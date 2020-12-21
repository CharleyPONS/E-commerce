import { Schema } from '@tsed/mongoose';
import { Enum, Minimum, Property, Required } from '@tsed/schema';

import { IdDb } from '../../../core/models/enum/id-db.enum';
import { CATEGORIES, UNITY } from '../../Product/entity/product.enum';

@Schema({
  connection: IdDb.SHOP_DATABASE
})
export class UserOrderedProductsSchema {
  @Required()
  @Property()
  @Enum(CATEGORIES)
  type: CATEGORIES;

  @Required()
  @Property()
  @Minimum(2)
  amount: number;

  @Required()
  @Property()
  @Enum(UNITY)
  unityMeasure: UNITY;
}
