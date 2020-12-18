import {Controller, Delete, Get, PathParams, UseBefore} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Status, Summary} from "@tsed/schema";
import {UserService} from "../services/UserService";
import {User} from "../models/user";
import {AuthJWTMiddleware} from "../../core/middleware/authJWT.middleware";


@Controller({
    path: "/user",
})
export class UserCtrl {
    constructor(private _userService: UserService) {}

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

}
