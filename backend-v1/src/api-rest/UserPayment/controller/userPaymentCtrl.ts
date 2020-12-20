import { BodyParams, Controller, PathParams, Post, UseBefore } from '@tsed/common';
import { Required, Returns, Summary } from '@tsed/schema';

import { RegisterMiddleware } from '../../../Core/middleware/register.middleware';
import { UserModel } from '../../User/models/user.model';
import { RegistrationService } from '../service/registration.service';

@Controller({
  path: '/create-payment-session'
})
export class UserPaymentCtrl {
  constructor(private _registrationRepository: RegistrationService) {}

  @Post('/')
  @Summary('Return all Product')
  @UseBefore(RegisterMiddleware)
  async registerUser(@Required() @PathParams('userId') userId: string): Promise<void> {
    return this._registrationRepository.main(registrationInfo);
  }
}
