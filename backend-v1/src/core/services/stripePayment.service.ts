import { deepClone } from '@tsed/core';
import { Service } from '@tsed/di';
import { NotFound } from '@tsed/exceptions';
import { Stripe } from 'stripe';

import { ConfigurationPromotionEntity } from '../../api-rest/Configuration/entities/configurationPromotion.entity';
import { ConfigurationType } from '../../api-rest/Configuration/entities/configurationType.enum';
import { ConfigurationRepository } from '../../api-rest/Configuration/service/configuration.repository';
import { ProductEntity } from '../../api-rest/Product/entities/product.entity';
import { CATEGORIES, UNITY } from '../../api-rest/Product/entities/product.enum';
import { ProductRepository } from '../../api-rest/Product/services/product.repository';
import { UserEntity } from '../../api-rest/User/entities/user.entity';
import { UserRepository } from '../../api-rest/User/services/user.repository';
import { UserOrderedEntity } from '../../api-rest/UserOrdered/entities/userOrdered.entity';
import { UserOrderedProductsEntity } from '../../api-rest/UserOrdered/entities/userOrderedProducts.entity';
import { UserOrderedRepository } from '../../api-rest/UserOrdered/services/userOrdered.repository';
import { IListOrderInterface } from '../../api-rest/UserPayment/models/listOrderInterface';
import { config } from '../config';
import { IStripeConfigInterface } from '../models/interface/stripeConfig.interface';

import { $logger } from './customLogger';

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
    listOrder: IListOrderInterface
  ): Promise<{
    clientSecret: string | null;
  }> {
    const user = await this._userRepository.findByEmail(listOrder?.userEmail);
    if (!user) {
      $logger.fatal('user trying to purchase payment is not in our base', { user, listOrder });
      throw new NotFound('user trying to purchase payment is not in our base');
    }
    if (!listOrder) {
      $logger.fatal('user trying to purchase have not product in his own', { user, listOrder });
      throw new NotFound('user trying to purchase have not product in his own');
    }
    $logger.info('user is identified, listOrder is present payment process can start now', {
      user,
      listOrder
    });
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
    const amount: { price: number } = await this.calculateOrderAmountLogic(user, listOrder);
    if (!amount) {
      $logger.fatal('user trying to purchase have an amount at 0', { user, amount });
      throw new NotFound('user trying to purchase have an amount at 0');
    }

    $logger.info('price have been set for user transaction and payment can begin now', {
      user,
      price: amount
    });

    const userOrder: UserOrderedEntity = new UserOrderedEntity();
    userOrder.paid = false;
    userOrder.amount = amount?.price;
    userOrder.userId = listOrder?.userId || user?.userId;
    userOrder.transporter = listOrder.shipment;
    const userOrderProduct: UserOrderedProductsEntity = new UserOrderedProductsEntity();
    const userProduct: any[] = [];
    (listOrder.product || []).forEach(v => {
      userOrderProduct.quantity = v.quantity;
      userOrderProduct.productName = v.productName;
      userOrderProduct.grammeNumber = v.grammeNumber;
      userOrderProduct.unityMeasure =
        v.categories === CATEGORIES.FLOWER || v.categories === CATEGORIES.RESINE
          ? UNITY.GRAMME
          : UNITY.SIMPLE_UNITY;
      userProduct.push(deepClone(userOrderProduct));
    });
    userOrder.product = userProduct;

    const saveUserOrdered = await this._userOrderedRepository.saveUserOrder(userOrder);

    $logger.info('user ordered have been save on stripe payment service', {
      user,
      userOrder
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount.price * 100,
      receipt_email: config.EMAIL,
      currency: 'EUR',
      use_stripe_sdk: true,
      description: `Product: ${listOrder?.product?.map(
        v => v.productName
      )}, Quantity: ${listOrder?.product?.map(m => m.quantity)}`,
      statement_descriptor: `${config.STATEMENT_DESCRIPTOR}`.substr(0, 22),
      metadata: {
        client: `${listOrder.userEmail}`,
        amount: `Amount: ${amount}`,
        userOrderedId: saveUserOrdered.userOrderedId
      }
    });
    return {
      clientSecret: paymentIntent.client_secret
    };
  }

  private async calculateOrderAmountLogic(
    user: UserEntity,
    listOrder: IListOrderInterface
  ): Promise<{ price: number }> {
    if (!Array.isArray(listOrder.product)) {
      $logger.info('list order contain no product', {
        user,
        listOrder
      });
    }
    let amount = 0;
    const listOrderProduct: Array<{ productName: string; quantity: number; grammeNumber: number }> =
      listOrder.product;
    const product: ProductEntity[] = await this._productRepository.findManyProduct(
      listOrderProduct.map(v => v.productName)
    );
    // @ts-ignore
    if (!product && !Array.isArray(product) && product.length < 1) {
      $logger.fatal('user trying to purchase have PRODUCT WHO MATCH NOTHING IN BASE', {
        user,
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
              switch (productOrder.grammeNumber) {
                case 3:
                  amount =
                    amount + productSelected?.price?.priceForThreeGramme * productOrder.quantity;
                  break;
                case 5:
                  amount =
                    amount + productSelected?.price?.priceForFiveGramme * productOrder.quantity;
                  break;
                case 10:
                  amount =
                    amount + productSelected?.price?.priceForTenGramme * productOrder.quantity;
                  break;
                case 1:
                  amount = amount + productSelected?.price?.basePrice * productOrder.quantity;
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
    const configuration = await this._configurationRepository.findByType(
      config.CONFIGURATION_TYPE as ConfigurationType
    );
    if (
      listOrder?.reduction?.isReduction &&
      listOrder?.reduction?.type &&
      Array.isArray(configuration[0].promotion)
    ) {
      const beforePrice: number = amount;
      const promotionRetrieve: ConfigurationPromotionEntity[] = configuration[0].promotion.filter(
        (v: any) => v.codePromotion === listOrder.reduction?.type
      );
      const priceReduction = promotionRetrieve ? promotionRetrieve[0]?.promotionReduction : 1;
      amount = amount - amount * (priceReduction / 100);
      $logger.info('reduction have been apply for user', {
        user,
        priceBefore: beforePrice,
        newPrice: amount,
        reduction: promotionRetrieve
      });
    }
    if (amount < configuration?.minPriceFreeShipment) {
      const configurationTransporterEntity = configuration[0].transporter.find(
        // @ts-ignore
        v => v.type === listOrder.shipment
      );
      amount =
        amount + (configurationTransporterEntity ? configurationTransporterEntity.basePrice : 0);
      $logger.info('price have been update with shipment tax for user', {
        user,
        price: amount,
        transporter: configurationTransporterEntity
      });
    }
    $logger.info('price have been set for user', { user, price: amount });
    return { price: this._roundToTwoDigitsAfterComma(amount) };
  }

  private _roundToTwoDigitsAfterComma(floatNumber: number) {
    return parseFloat((Math.round(floatNumber * 100) / 100).toFixed(2));
  }
}
