import { deepClone } from '@tsed/core';
import { Service } from '@tsed/di';
import * as fs from 'fs';

import { ProductEntity } from '../../api-rest/Product/entities/product.entity';
import { CATEGORIES } from '../../api-rest/Product/entities/product.enum';
import { ProductRepository } from '../../api-rest/Product/services/product.repository';
import { UserEntity } from '../../api-rest/User/entities/user.entity';
import { UserRepository } from '../../api-rest/User/services/user.repository';
import { UserOrderedEntity } from '../../api-rest/UserOrdered/entities/userOrdered.entity';
import { UserOrderedRepository } from '../../api-rest/UserOrdered/services/userOrdered.repository';
import { rootDir } from '../../Server';

import { $logger } from './customLogger';
// tslint:disable-next-line: no-var-requires
const pdf = require('pdf-creator-node');

@Service()
export class PdfCreatorService {
  constructor(
    private _userRepository: UserRepository,
    private _userOrderedRepository: UserOrderedRepository,
    private _productRepository: ProductRepository
  ) {}
  async main(userOrdered: UserOrderedEntity, user: UserEntity): Promise<boolean> {
    if (!userOrdered || !user) {
      return false;
    }
    const options = {
      format: 'A3',
      orientation: 'portrait',
      border: '10mm'
    };
    const userOrderedClone: UserOrderedEntity = deepClone(userOrdered);
    const product: ProductEntity[] = await this._productRepository.findManyProduct(
      (userOrderedClone.product || []).map(v => v.productName)
    );
    const productsBuilder: Array<{ name: string; price: number }> = [];
    (userOrderedClone.product || []).forEach(v => {
      (product || []).forEach(p => {
        let amount = 0;
        if (p.name === v.productName) {
          switch (p.categories) {
            case CATEGORIES.FLOWER:
            case CATEGORIES.RESINE:
              switch (v.grammeNumber) {
                case 3:
                  amount = amount + p?.price?.priceForThreeGramme * v.quantity;
                  break;
                case 5:
                  amount = amount + p?.price?.priceForFiveGramme * v.quantity;
                  break;
                case 10:
                  amount = amount + p?.price?.priceForTenGramme * v.quantity;
                  break;
                case 1:
                  amount = amount + p?.price?.basePrice * v.quantity;
                  break;
              }
              break;
            case CATEGORIES.ELIQUID:
            case CATEGORIES.GRINDER:
            case CATEGORIES.OIL:
            case CATEGORIES.PAPER:
              amount = amount + p?.price?.basePrice * v.quantity;
              break;
          }
          productsBuilder.push({
            name: v.productName,
            price: amount
          });
        }
      });
    });
    const billTemplate = fs.readFileSync(rootDir + '/core/helpers/template/bill.html', 'utf8');

    const document = {
      html: billTemplate,
      data: {
        products: productsBuilder,
        billNumber: userOrderedClone.billId,
        name: user.name,
        email: user.email,
        date: new Date().toLocaleDateString(),
        total: userOrdered.amount
      },
      path: rootDir + `/tmp/bill/${userOrderedClone.billId}.pdf`
    };
    try {
      if (fs.existsSync(rootDir + `/tmp/bill/${userOrderedClone.billId}.pdf`)) {
        fs.unlinkSync(rootDir + `/tmp/bill/${userOrderedClone.billId}.pdf`);
      }
      await pdf.create(document, options);
      $logger.info(`bill pdf have been created for user`, { user, bill: document });

      return true;
    } catch (err) {
      $logger.error(`bill pdf have been created for user`, { user, bill: document, error: err });

      return false;
    }
  }
}
