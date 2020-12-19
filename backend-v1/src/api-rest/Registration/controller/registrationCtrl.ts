import {BodyParams, Controller, Post, UseBefore} from "@tsed/common";
import {Required, Returns, Summary} from "@tsed/schema";
import {User} from "../../User/models/user";
import {RegisterMiddleware} from "../../../core/middleware/register.middleware";
import {RegistrationService} from "../service/registration.service";


@Controller({
    path: "/signup"
})
export class RegistrationCtrl {
    constructor(private _registrationService: RegistrationService) {}

    @Post("/")
    @Summary("Return all Product")
    @UseBefore(RegisterMiddleware)
    @(Returns(200, Object).Of(User).Description('Register Ok'))
    async registerUser(@Required() @BodyParams('registrationInfo') registrationInfo: User): Promise<void> {
        return this._registrationService.main(registrationInfo);
    }
}
