import { Service } from '@tsed/di';
import { NotFound } from '@tsed/exceptions';
import { Stripe } from 'stripe';

import { ConfigurationEntity } from '../../api-rest/Configuration/entities/configuration.entity';
import { ConfigurationType } from '../../api-rest/Configuration/entities/configurationType.enum';
import { ConfigurationRepository } from '../../api-rest/Configuration/service/configuration.repository';
import { ProductEntity } from '../../api-rest/Product/entities/product.entity';
import { CATEGORIES, UNITY } from '../../api-rest/Product/entities/product.enum';
import { ProductRepository } from '../../api-rest/Product/services/product.repository';
import { UserRepository } from '../../api-rest/User/services/user.repository';
import { IListOrderInterface } from '../../api-rest/UserPayment/models/listOrderInterface';
import { IStripeConfigInterface } from '../models/interface/stripeConfig.interface';

import { WinstonLogger } from './winstonLogger';
import { UserOrderedEntity } from '../../api-rest/UserOrdered/entities/userOrdered.entity';
import { UserOrderedProductsEntity } from '../../api-rest/UserOrdered/entities/userOrderedProducts.entity';
import { UserOrderedRepository } from '../../api-rest/UserOrdered/services/userOrdered.repository';

/**
 * Ce service est une validation côté serveur du prix de la commande pour éviter toute manipulation côté client du prix
 * Nous appliquons aussi la promotion côté serveur
 * Une fois que le paiement est effectué nous envoyons au client l'intention de paiement généré par stripe avec le secret client
 * La partie de modification des données côté serveur ce fera dans un autre service avec un webhook et une transaction globale.
 */
@Service()
export class StripePaymentService {
  constructor(
    private _userRepository: UserRepository,
    private _productRepository: ProductRepository,
    private _configurationRepository: ConfigurationRepository,
    private _userOrderedRepository: UserOrderedRepository
  ) {}
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
    const amount: { price: number } = await this.calculateOrderAmountLogic(userId, listOrder);
    if (!amount) {
      new WinstonLogger()
        .logger()
        .crit('user trying to purchase have an amount at 0', { userId, amount });
      throw new NotFound('user trying to purchase have an amount at 0');
    }

    new WinstonLogger()
      .logger()
      .info('price have been set for user transaction and payment can begin now', {
        userId,
        price: amount
      });

    const userOrder: UserOrderedEntity = new UserOrderedEntity();
    userOrder.paid = false;
    userOrder.amount = amount.price;
    userOrder.userId = listOrder.userId;
    const userOrderProduct: UserOrderedProductsEntity = new UserOrderedProductsEntity();
    const userProduct: any[] = [];
    (listOrder.product || []).forEach(v => {
      userOrderProduct.quantity = v.quantity;
      userOrderProduct.productName = v.productName;
      userOrderProduct.type = v.categories;
      userOrderProduct.unityMeasure =
        v.categories === CATEGORIES.FLOWER || v.categories === CATEGORIES.RESINE
          ? UNITY.GRAMME
          : UNITY.SIMPLE_UNITY;
      userProduct.concat(userOrderProduct);
    });
    userOrder.product = userProduct;

    await this._userOrderedRepository.saveUserOrder(userOrder);

    new WinstonLogger().logger().info('user ordered have been save on stripe payment service', {
      userId,
      userOrder
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount.price * 100,
      receipt_email: process.env.EMAIL,
      currency: 'EUR',
      use_stripe_sdk: true,
      description: `Product: ${listOrder?.product?.map(
        v => v.productName
      )}, Quantity: ${listOrder?.product?.map(m => m.quantity)}`,
      statement_descriptor: `${process.env.STATEMENT_DESCRIPTOR}`.substr(0, 22),
      metadata: {
        client: `Email client: ${listOrder.userEmail}`,
        amount: `Amount: ${amount}`
      }
    });
    return {
      clientSecret: paymentIntent.client_secret
    };
  }

  private async calculateOrderAmountLogic(
    userId: number,
    listOrder: IListOrderInterface
  ): Promise<{ price: number }> {
    if (!Array.isArray(listOrder.product)) {
      new WinstonLogger().logger().info('list order contain no product', {
        userId,
        listOrder
      });
    }
    let amount = 0;
    const listOrderProduct: Array<{ productName: string; quantity: number }> = listOrder.product;
    const product: ProductEntity[] = await this._productRepository.findManyProduct(
      listOrderProduct.map(v => v.productName)
    );
    // @ts-ignore
    if (!product && !Array.isArray(product) && product.length < 1) {
      new WinstonLogger()
        .logger()
        .crit('user trying to purchase have PRODUCT WHO MATCH NOTHING IN BASE', {
          userId,
          listOrder
        });
      throw new NotFound('user trying to purchase have PRODUCT WHO MATCH NOTHING IN BASE');
    }
    for (const productSelected of product) {
      for (const productOrder of listOrderProduct) {
        if (productSelected.name === productOrder.productName) {
          switch (productSelected.categories) {
            case CATEGORIES.FLOWER:
            case CATEGORIES.RESINE:
              switch (productOrder.quantity) {
                case 3:
                  amount = amount + productSelected?.price?.priceForThreeGramme;
                  break;
                case 5:
                  amount = amount + productSelected?.price?.priceForFiveGramme;
                  break;
                case 10:
                  amount = amount + productSelected?.price?.priceForTenGramme;
                  break;
                case 1:
                  amount = amount + productSelected?.price?.basePrice;
                  break;
              }
              break;
            case CATEGORIES.ELIQUID:
            case CATEGORIES.GRINDER:
            case CATEGORIES.OIL:
            case CATEGORIES.PAPER:
              amount = amount + productSelected?.price?.basePrice * productOrder.quantity;
              break;
          }
        }
      }
    }
    const configuration: ConfigurationEntity = await this._configurationRepository.findByType(
      process.env.CONFIGURATION_TYPE as ConfigurationType
    );
    if (listOrder.reduction && configuration.isPromotion && configuration.promotionReduction) {
      const beforePrice: number = amount;
      amount = amount - amount * (configuration.promotionReduction / 100);
      new WinstonLogger().logger().info('reduction have been apply for user', {
        userId,
        priceBefore: beforePrice,
        newPrice: amount,
        reduction: configuration.promotionReduction
      });
    }
    new WinstonLogger().logger().info('price have been set for user', { userId, price: amount });

    return { price: amount };
  }
}
