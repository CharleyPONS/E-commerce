import { BodyParams, Context, Controller, Post, UseBefore } from '@tsed/common';
import { Required, Returns, Summary } from '@tsed/schema';

import { RegisterMiddleware } from '../../../core/middleware/register.middleware';
import { UserEntity } from '../../User/entities/user.entity';
import { RegistrationService } from '../service/registration.service';
import { IUser } from '../../User/models/user.interface';
import { UserLogInService } from '../../User/services/userLogIn.service';

@Controller({
  path: '/signUp'
})
export class RegistrationCtrl {
  constructor(
    private _registrationService: RegistrationService,
    private _userLoginService: UserLogInService
  ) {}

  @Post('/')
  @Summary('Return token for get auth')
  @UseBefore(RegisterMiddleware)
  @(Returns(200).Description('Register Ok'))
  async registerUser(
    @Context() ctx: Context,
    @Required() @BodyParams() registrationInfo: UserEntity
  ): Promise<UserEntity | undefined> {
    await this._registrationService.main(registrationInfo);
    const user: IUser = await this._userLoginService.main(ctx, registrationInfo);
    return ctx.getResponse().status(200).send(user);
  }
}
