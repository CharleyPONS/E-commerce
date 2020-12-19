import {BodyParams, Context, Controller, Delete, Get, PathParams, Post, UseBefore} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Status, Summary} from "@tsed/schema";
import {UserCRUDService} from "../services/userCRUD.service";
import {User} from "../models/user";
import {AuthJWTMiddleware} from "../../../core/middleware/authJWT.middleware";
import {UserLogInService} from "../services/userLogIn.service";
import {UserDeleteTokenService} from "../services/userDeleteToken.service";



@Controller({
    path: "/user",
})
export class UserCtrl {
    constructor(private _userService: UserCRUDService,
                private _userLoginService: UserLogInService,
                private _userDeleteToken: UserDeleteTokenService) {}

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
        const user: User = await this._userLoginService.main(ctx, userBody);
        return ctx.getResponse().status(200).send(user)

    }

    @Post("/logout")
    @Summary("Delete JWT token")
    @(Status(200).Description('Success'))
    async logOut(@Context() ctx: Context, @BodyParams('user') userBody: User): Promise<void> {
        await this._userDeleteToken.main(userBody);
        return;
    }
}
