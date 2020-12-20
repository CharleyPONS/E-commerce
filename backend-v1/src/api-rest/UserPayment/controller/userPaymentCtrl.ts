import { BodyParams, Context, Controller, PathParams, Post, UseBefore } from '@tsed/common';
import { Required, Summary } from '@tsed/schema';

import { AuthJWTMiddleware } from '../../../core/middleware/authJWT.middleware';
import { StripePaymentService } from '../../../core/services/stripePayment.service';
import { IListOrderInterface } from '../models/listOrderInterface';

@Controller({
  path: '/create-payment-session'
})
export class UserPaymentCtrl {
  constructor(private _stripePaymentService: StripePaymentService) {}

  @Post('/')
  @Summary('Return all Product')
  @UseBefore(AuthJWTMiddleware)
  async registerUser(
    @Context() ctx: Context,
    @Required() @PathParams('userId') userId: string,
    @BodyParams('listOrder')
    listOrder: IListOrderInterface
  ): Promise<void> {
    const secretClient: {
      clientSecret: string | null;
    } = await this._stripePaymentService.main(userId, listOrder);
    ctx.getResponse().status(200).send(secretClient);
  }
}
