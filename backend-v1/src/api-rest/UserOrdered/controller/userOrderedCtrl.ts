import { BodyParams, Context, Controller, Get, PathParams, Post, UseBefore } from '@tsed/common';
import { Returns, Summary } from '@tsed/schema';

import { NotFound } from '@tsed/exceptions';
import { AuthJWTMiddleware } from '../../../core/middleware/authJWT.middleware';
import { $logger } from '../../../core/services/customLogger';
import { UserRepository } from '../../User/services/user.repository';
import { UserOrderedEntity } from '../entities/userOrdered.entity';
import { UserCommandService } from '../services/userCommand.service';
import { UserOrderedRepository } from '../services/userOrdered.repository';

@Controller({
  path: '/user-product-order'
})
export class UserCtrl {
  constructor(
    private _userCommandService: UserCommandService,
    private _userRepository: UserRepository,
    private _userOrderedRepository: UserOrderedRepository
  ) {}

  @Post('/:id')
  @Summary('Return a User Command from his ID')
  @UseBefore(AuthJWTMiddleware)
  @Returns(200)
  async userCommand(
    @Context() ctx: Context,
    @BodyParams('userCommand') userCommand: UserOrderedEntity
  ): Promise<void> {
    await this._userCommandService.main(ctx, userCommand);
  }

  @Get('/:token')
  @Summary('Return all User Ordered')
  @UseBefore(AuthJWTMiddleware)
  @(Returns(200, Array).Of(UserOrderedEntity))
  async allUserCommand(
    @Context() ctx: Context,
    @PathParams('token') token: string
  ): Promise<UserOrderedEntity[]> {
    const user = await this._userRepository.findByToken(token);
    if (!user) {
      $logger.warn(`user not found`, { token });
      throw new NotFound('user not found');
    }
    return this._userOrderedRepository.findAll();
  }
}
