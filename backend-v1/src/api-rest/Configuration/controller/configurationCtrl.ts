import {BodyParams, Context, Controller, Get, Post, UseBefore} from "@tsed/common";
import {Returns, Status, Summary} from "@tsed/schema";
import {AuthJWTMiddleware} from "../../../core/middleware/authJWT.middleware";
import {UserOrdered} from "../models/userOrdered";
import {UserCommandService} from "../services/userCommand.service";


@Controller({
    path: "/configuration",
})
export class ConfigurationCtrl {
    constructor(private _userCommandService: UserCommandService) {}

    @Get("")
    @Summary("Return a User from his ID")
    @Returns(200).Description('get Config')
    async getConfiguration(@Context() ctx: Context): Promise<void> {
        await this._userCommandService.main(ctx, userCommand)
    }
}
