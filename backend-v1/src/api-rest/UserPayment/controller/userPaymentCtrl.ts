import { BodyParams, Context, Controller, Post, Req, UseBefore } from '@tsed/common';
import { ProxyError } from '@tsed/exceptions';
import { Summary } from '@tsed/schema';
import { Request } from 'express';
import { Stripe } from 'stripe';

import { config } from '../../../core/config';
import { AuthJWTMiddleware } from '../../../core/middleware/authJWT.middleware';
import { MailProcess } from '../../../core/models/enum/mailProcess.enum';
import { IStripeConfigInterface } from '../../../core/models/interface/stripeConfig.interface';
import { $logger } from '../../../core/services/customLogger';
import { EmailSenderService } from '../../../core/services/emailSender.service';
import { PdfCreatorService } from '../../../core/services/pdfCreator.service';
import { StripePaymentService } from '../../../core/services/stripePayment.service';
import { UserRepository } from '../../User/services/user.repository';
import { UserOrderedRepository } from '../../UserOrdered/services/userOrdered.repository';
import { IListOrderInterface } from '../models/listOrderInterface';
@Controller({
  path: '/user-payment'
})
export class UserPaymentCtrl {
  constructor(
    private _stripePaymentService: StripePaymentService,
    private _userRepository: UserRepository,
    private _userOrderedRepository: UserOrderedRepository,
    private _pdfCreatorService: PdfCreatorService,
    private _emailSenderService: EmailSenderService
  ) {}

  @Post('/intent-payment')
  @Summary('Return all Product')
  @UseBefore(AuthJWTMiddleware)
  async registerUser(
    @Context() ctx: Context,
    @BodyParams()
    listOrder: IListOrderInterface
  ): Promise<{
    clientSecret: string | null;
  }> {
    return this._stripePaymentService.main(listOrder);
  }

  @Post('/stripe-webhook-success')
  @Summary('Response hook from stripe and update db')
  async successPaymentHook(@Context() ctx: Context, @Req() req: Request): Promise<void> {
    let responseStripe = ctx?.request?.body;
    if (!responseStripe) {
      $logger.info('error trying to parse stripe webhook body', { body: ctx.request.body });
      return ctx.getResponse().status(500).send();
    }
    const stripeConfig: IStripeConfigInterface = {
      apiKey:
        config.NODE_ENV === 'development'
          ? config.SECRET_KEY_DEVELOPMENT
          : config.SECRET_KEY_PRODUCTION,
      apiVersion: '2020-08-27',
      protocol: config.PROTOCOL_HTTP as 'http' | 'https'
    };
    const stripeConfigOptions: IStripeConfigInterface = { ...stripeConfig };
    delete stripeConfigOptions.apiKey;
    const stripe = new Stripe(stripeConfig.apiKey as string, stripeConfigOptions);
    const endpointSecret: any = config.SECRET_KEY_WEBHOOK;
    if (endpointSecret) {
      const signature = ctx.request.headers['stripe-signature'] as any;
      try {
        responseStripe = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
      } catch (err) {
        $logger.fatal('error trying to get signature from stripe', {
          body: req.body,
          sign: signature
        });
        throw new ProxyError('Failed to authenticate to stripe');
      }
    }
    switch (responseStripe.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = responseStripe.data.object;
        const user = await this._userRepository.findByEmail(paymentIntent?.metadata?.client);
        if (user) {
          const userOrdered = await this._userOrderedRepository.findByUserIdAndUserOrderedId(
            user.userId,
            paymentIntent?.metadata?.userOrderedId
          );
          await this._userOrderedRepository.updateOne(
            { userId: user.userId },
            { paid: true },
            user
          );
          if (userOrdered) {
            const isPdf = await this._pdfCreatorService.main(userOrdered, user);
            if (isPdf) {
              await this._emailSenderService.main(
                user,
                MailProcess.VALIDATE_ORDER,
                paymentIntent?.metadata?.userOrderedId
              );
            }
          }
        }
        break;
    }
    return;
  }
}
