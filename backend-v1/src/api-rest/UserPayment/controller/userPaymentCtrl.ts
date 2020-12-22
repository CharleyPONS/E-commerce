import { BodyParams, Context, Controller, PathParams, Post, UseBefore } from '@tsed/common';
import { Required, Summary } from '@tsed/schema';

import { AuthJWTMiddleware } from '../../../core/middleware/authJWT.middleware';
import { StripePaymentService } from '../../../core/services/stripePayment.service';
import { IListOrderInterface } from '../models/listOrderInterface';

@Controller({
  path: '/user-payment'
})
export class UserPaymentCtrl {
  constructor(private _stripePaymentService: StripePaymentService) {}

  @Post('/intent-payment')
  @Summary('Return all Product')
  @UseBefore(AuthJWTMiddleware)
  async registerUser(
    @Context() ctx: Context,
    @Required() @PathParams('userId') userId: number,
    @BodyParams('listOrder')
    listOrder: IListOrderInterface
  ): Promise<void> {
    const secretClient: {
      clientSecret: string | null;
    } = await this._stripePaymentService.main(userId, listOrder);
    ctx.getResponse().status(200).send(secretClient);
  }

  @Post('/stripe-webhook-success')
  @Summary('Response hook from stripe and update db')
  async successPaymentHook(@Context() ctx: Context): Promise<void>{
    let responseStripe;
    try {
      responseStripe = JSON.parse(ctx.request.body);
    } catch (err) {
      return ctx.getResponse().status(500).send();
    }
    //TODO let the switch case for more hook set in the future
    //TODO Update entity with transaction
    switch (responseStripe.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = responseStripe.data.object;
        break;
    }
    response.send();
  }
}
