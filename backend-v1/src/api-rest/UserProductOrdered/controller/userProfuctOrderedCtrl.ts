import {Controller, PathParams, Post, UseBefore} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Status, Summary} from "@tsed/schema";
import {AuthJWTMiddleware} from "../../../core/middleware/authJWT.middleware";
import {UserCRUDService} from "../../User/services/userCRUD.service";
import {WinstonLogger} from "../../../core/winston-logger";
import {User} from "../../User/models/user";


@Controller({
    path: "/user-product-order",
})
export class UserCtrl {
    constructor(private _userService: UserCRUDService) {}

    @Post("/:id")
    @Summary("Return a User from his ID")
    @UseBefore(AuthJWTMiddleware)
    @(Status(200).Description("Success"))
    async userCommand(@PathParams("id") id: string): Promise<void> {
        const user: User = await this._userService.findById(id);
        if (!user) {
            new WinstonLogger().logger().info(`User not found`, {userId: id});
            throw new NotFound("User not present");
        }
        new WinstonLogger().logger().info(`User avc orederd but payment is not yet validate`, {userId: id});
        await this._userService.save({...user, numberOrder: (user.numberOrder || []).concat({isValidate: false, madeAt: new Date().toISOString()})})
    }
}
