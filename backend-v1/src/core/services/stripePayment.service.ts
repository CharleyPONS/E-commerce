import { Service } from '@tsed/di';
import { Stripe } from 'stripe';

import { IStripeConfigInterface } from '../models/interface/stripeConfig.interface';
@Service()
export class StripePaymentService {
  constructor() {}
  async main() {
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
  }
}
