import { Schema } from '@tsed/mongoose';
import { Property, Required } from '@tsed/schema';

import { IdDb } from '../../../Core/models/enum/id-db.enum';

@Schema({
  connection: IdDb.SHOP_DATABASE
})
export class UserAddressSchema {
  @Required()
  @Property()
  town: string;

  @Required()
  @Property()
  street: string;

  @Required()
  @Property()
  numberStreet: number;

  @Required()
  @Property()
  postalCode: number;

  @Required()
  @Property()
  country: string;
}
