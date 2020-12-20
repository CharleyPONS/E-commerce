import {BodyParams, Context, Controller, Post, UseBefore} from "@tsed/common";
import {Returns, Status, Summary} from "@tsed/schema";
import {AuthJWTMiddleware} from "../../../core/middleware/authJWT.middleware";
import {UserOrdered} from "../models/userOrdered";
import {UserCommandService} from "../services/userCommand.service";


@Controller({
    path: "/user-product-order",
})
export class UserCtrl {
    constructor(private _userCommandService: UserCommandService) {}

    @Post("/:id")
    @Summary("Return a User from his ID")
    @UseBefore(AuthJWTMiddleware)
    @Returns(200)
    async userCommand(@Context() ctx: Context, @BodyParams("userCommand") userCommand: UserOrdered): Promise<void> {
        await this._userCommandService.main(ctx, userCommand)
    }
}