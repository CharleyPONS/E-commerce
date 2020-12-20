import { Schema } from '@tsed/mongoose';
import { Enum, Property, Required } from '@tsed/schema';

import { IdDb } from '../../../Core/models/enum/id-db.enum';

import { UNITY } from './product.enum';

@Schema({
  connection: IdDb.SHOP_DATABASE
})
export class ProductStockSchema {
  @Required()
  @Property()
  quantity: number;

  @Required()
  @Property()
  @Enum(UNITY)
  unityMeasure: UNITY;
}
