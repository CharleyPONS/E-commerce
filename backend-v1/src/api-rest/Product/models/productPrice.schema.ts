import { Schema } from '@tsed/mongoose';
import { Description, Property, Required } from '@tsed/schema';

import { IdDb } from '../../../core/models/enum/id-db.enum';

@Schema({
  connection: IdDb.SHOP_DATABASE
})
export class ProductPriceSchema {
  @Required()
  @Property()
  @Description('base price for one unit or one gramme for cbd')
  basePrice: number;

  @Property()
  priceForThreeGramme: number;

  @Property()
  priceForFiveGramme: number;

  @Property()
  priceForTenGramme: number;
}
