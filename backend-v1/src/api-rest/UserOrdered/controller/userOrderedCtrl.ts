import { BodyParams, Context, Controller, Get, PathParams, Post, UseBefore } from '@tsed/common';
import { Returns, Summary } from '@tsed/schema';

import { AuthJWTMiddleware } from '../../../core/middleware/authJWT.middleware';
import { UserOrderedEntity } from '../entities/userOrdered.entity';
import { UserCommandService } from '../services/userCommand.service';
import { UserRepository } from '../../User/services/user.repository';
import { WinstonLogger } from '../../../core/services/winstonLogger';
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
  @Returns(200)
  async allUserCommand(
    @Context() ctx: Context,
    @PathParams('token') token: string
  ): Promise<UserOrderedEntity[]> {
    const user = await this._userRepository.findByToken(token);
    if (!user) {
      new WinstonLogger().logger().warn(`user not found`, { token });
      throw new Error('user not found');
    }
    const userOrdered: UserOrderedEntity[] = await this._userOrderedRepository.findAll();
    return ctx.getResponse().status(200).send(userOrdered);
  }
}
