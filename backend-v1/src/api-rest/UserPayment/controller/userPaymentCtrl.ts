import { BodyParams, Context, Controller, PathParams, Post, UseBefore } from '@tsed/common';
import { Required, Summary } from '@tsed/schema';
import { Stripe } from 'stripe';

import { AuthJWTMiddleware } from '../../../core/middleware/authJWT.middleware';
import { IStripeConfigInterface } from '../../../core/models/interface/stripeConfig.interface';
import { StripePaymentService } from '../../../core/services/stripePayment.service';
import { WinstonLogger } from '../../../core/services/winstonLogger';
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
  async successPaymentHook(@Context() ctx: Context): Promise<void> {
    let responseStripe;
    try {
      responseStripe = JSON.parse(ctx.request.body);
    } catch (err) {
      new WinstonLogger()
        .logger()
        .crit('error trying to parse stripe webhook body', { body: ctx.request.body });
      return ctx.getResponse().status(500).send();
    }
    const stripeConfig: IStripeConfigInterface = {
      apiKey:
        process.env.NODE_ENV === 'development'
          ? process.env.SECRET_KEY_DEVELOPMENT
          : process.env.SECRET_KEY_PRODUCTION,
      apiVersion: '2020-08-27',
      protocol: process.env.PROTOCOL_HTTP as 'http' | 'https'
    };
    const stripeConfigOptions: IStripeConfigInterface = { ...stripeConfig };
    delete stripeConfigOptions.apiKey;
    const stripe = new Stripe(stripeConfig.apiKey as string, stripeConfigOptions);
    const endpointSecret: any = process.env.SECRET_KEY_WEBHOOK;
    if (endpointSecret) {
      const signature = ctx.request.headers['stripe-signature'] as any;
      try {
        responseStripe = stripe.webhooks.constructEvent(
          ctx.request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        new WinstonLogger().logger().crit('error trying toget signature from stripe', {
          body: ctx.request.body,
          sign: signature
        });
        return ctx.getResponse().status(500).send();
      }
    }
    switch (responseStripe.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = responseStripe.data.object;
        break;
    }
    return ctx.getResponse().status(200).send();
  }
}
