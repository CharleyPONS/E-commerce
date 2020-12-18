import {BodyParams, Context, Controller, Delete, Get, PathParams, Post, UseBefore} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Status, Summary} from "@tsed/schema";
import {UserCRUD} from "../services/UserCRUD";
import {User} from "../models/user";
import {AuthJWTMiddleware} from "../../core/middleware/authJWT.middleware";
import {WinstonLogger} from "../../core/winston-logger";
import {compareSync} from "bcrypt";
import {sign} from "jsonwebtoken";


@Controller({
    path: "/user",
})
export class UserCtrl {
    constructor(private _userService: UserCRUD) {}

    @Get("/:id")
    @Summary("Return a User from his ID")
    @UseBefore(AuthJWTMiddleware)
    @(Status(200, User).Description("Success"))
    async getUser(@PathParams("id") id: string): Promise<User> {
        const user = await this._userService.findById(id);

        if (user) {
            return user;
        }

        throw new NotFound("User not present");
    }

    @Delete("/:id")
    @Summary("Delete a User from his ID")
    @(Status(204, User).Description("Success delete"))
    async deleteUser(@PathParams("id") id: string): Promise<User> {
        const user = await this._userService.delete(id);
        if (user) {
            return user;
        }
        throw new NotFound("User not found so not deleted");
    }

    @Post("/signIn")
    @Summary("Return JWT token if sign in succeed")
    @(Status(200, User).Description('Success'))
    async logInUser(@Context() ctx: Context, @BodyParams('user') userBody: User): Promise<User> {
        const user: User = await this._userService.findByEmail(userBody?.email);
        if(!user){
            new WinstonLogger().logger().info(`User not found to login`, {userBody});
            throw new NotFound("User not found to login ");
        }
        const passwordValid: boolean = compareSync(userBody?.password, user?.password);
        if(!passwordValid){
            new WinstonLogger().logger().info(`Password wrong`, {userBody});
            ctx.getResponse().status(500).send({
                ...user, token: ''
            })
        }
        const token: string = sign({id: user._id}, process.env.JWT_KEY as string, {expiresIn: process.env.JWT_EXPIRES_MS});
        new WinstonLogger().logger().info(`Token create for user`, {user, token});
        return ctx.getResponse().status(200).send({...user, token: token})


    }

}
