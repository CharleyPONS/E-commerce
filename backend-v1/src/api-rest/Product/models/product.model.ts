import { Next } from '@tsed/common';
import { Model, ObjectID, PreHook } from '@tsed/mongoose';
import { Description, Enum, Maximum, Minimum, Property, Required } from '@tsed/schema';

import { IdDb } from '../../../core/models/enum/id-db.enum';

import { ProductStockSchema } from './productStock.schema';
import { CATEGORIES } from './product.enum';
import { ProductPriceSchema } from './productPrice.schema';

@Model({
  connection: IdDb.SHOP_DATABASE,
  collection: 'products'
})
@PreHook('save', (product: ProductModel, next: Next) => {
  if (!product.dateUpdate) {
    product.dateUpdate = new Date().toISOString();
  }
  next();
})
export class ProductModel {
  @ObjectID('id')
  _id?: string;

  @Required()
  @Property()
  name: string;

  @Required()
  @Property()
  @Enum(CATEGORIES)
  categories: CATEGORIES;

  @Required()
  @Minimum(5)
  @Maximum(100)
  @Property()
  price: ProductPriceSchema;

  @Minimum(0)
  @Maximum(80)
  @Property()
  cbdRate?: number;

  @Minimum(0)
  @Maximum(1)
  @Property()
  thcRate?: number;

  @Property()
  @Description('Last modification date')
  dateUpdate?: string;

  @Property()
  @Description('Depending on the product in stock we add the right unity of measure')
  stock?: ProductStockSchema;
}
