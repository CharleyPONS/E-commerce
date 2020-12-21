import { BodyParams, Controller, Post, UseBefore } from '@tsed/common';
import { Required, Returns, Summary } from '@tsed/schema';

import { RegisterMiddleware } from '../../../core/middleware/register.middleware';
import { UserEntity } from '../../User/entity/user.entity';
import { RegistrationService } from '../service/registration.service';

@Controller({
  path: '/signup'
})
export class RegistrationCtrl {
  constructor(private _registrationRepository: RegistrationService) {}

  @Post('/')
  @Summary('Return all Product')
  @UseBefore(RegisterMiddleware)
  @(Returns(200, Object).Of(UserEntity).Description('Register Ok'))
  async registerUser(
    @Required() @BodyParams('registrationInfo') registrationInfo: UserEntity
  ): Promise<void> {
    return this._registrationRepository.main(registrationInfo);
  }
}
