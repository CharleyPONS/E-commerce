// TODO y'en aura pas beaucoup mais force toi a foutre des tests unitaires solide sur ce truc! Surout sur la logique de calcul de paiement
// TODO Il faut faire au moins 10 combinaisons avec une carte de cred mocké et testé des réductions
// TODO Il faut mettre un service d'enregistrement de la carte avec stripe
// TODO Il faut mettre un systeme d'editionc de facture ou le faire coté client avec la méthode bring in de strip
import { Service } from '@tsed/di';
import { NotFound } from '@tsed/exceptions';
import { Stripe } from 'stripe';

import { UserRepository } from '../../api-rest/User/services/user.repository';
import { IStripeConfigInterface } from '../models/interface/stripeConfig.interface';

import { WinstonLogger } from './winston-logger';
import { IListOrderInterface } from '../../api-rest/UserPayment/models/listOrderInterface';
@Service()
export class StripePaymentService {
  constructor(private _userRepository: UserRepository) {}
  async main(
    userId: number,
    listOrder: IListOrderInterface
  ): Promise<{
    clientSecret: string | null;
  }> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      new WinstonLogger()
        .logger()
        .crit('user trying to purchase payment is not in our base', { userId, listOrder });
      throw new NotFound('user trying to purchase payment is not in our base');
    }
    if (!listOrder) {
      new WinstonLogger()
        .logger()
        .crit('user trying to purchase have not product in his own', { userId, listOrder });
      throw new NotFound('user trying to purchase have not product in his own');
    }
    new WinstonLogger()
      .logger()
      .info('user is identified, listOrder is present payment process can start now', {
        userId,
        listOrder
      });
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
    const amount: { price: number } = await this.calculateOrderAmountLogic(listOrder);

    //TODO regarder en profondeur cette objet et les props de son modèle PaymentIntentCreateParams voir ce qu'on peut rajouter en config
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount.price,
      currency: 'EUR'
    });
    return {
      clientSecret: paymentIntent.client_secret
    };
  }

  private async calculateOrderAmountLogic(
    listOrder: IListOrderInterface
  ): Promise<{ price: number }> {
    //TODO LOGIC PAYMENT
    return { price: 10000000000000000000000000000000000 };
  }
}
