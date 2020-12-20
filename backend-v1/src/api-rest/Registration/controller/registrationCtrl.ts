import {BodyParams, Controller, Post, UseBefore} from "@tsed/common";
import {Required, Returns, Summary} from "@tsed/schema";
import {UserModel} from "../../User/models/user.model";
import {RegisterMiddleware} from "../../../core/middleware/register.middleware";
import {RegistrationRepository} from "../service/registration.repository";


@Controller({
    path: "/signup"
})
export class RegistrationCtrl {
    constructor(private _registrationRepository: RegistrationRepository) {}

    @Post("/")
    @Summary("Return all Product")
    @UseBefore(RegisterMiddleware)
    @(Returns(200, Object).Of(UserModel).Description('Register Ok'))
    async registerUser(@Required() @BodyParams('registrationInfo') registrationInfo: UserModel): Promise<void> {
        return this._registrationRepository.main(registrationInfo);
    }
}
