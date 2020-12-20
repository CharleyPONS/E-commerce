import { Next } from '@tsed/common';
import { Model, ObjectID, PreHook } from '@tsed/mongoose';
import { Allow, Description, Email, Property, Required } from '@tsed/schema';

import { IdDb } from '../../../Core/models/enum/id-db.enum';

import { UserAddressSchema } from './userAddress.schema';

// Use save in place of update to apply hook middleware
@Model({
  connection: IdDb.SHOP_DATABASE,
  collection: 'users'
})
@PreHook('save', (user: UserModel, next: Next) => {
  if (!user.updatedAt) {
    user.updatedAt = new Date().toISOString();
  }
  next();
})
export class UserModel {
  @Required()
  @ObjectID('id')
  _id: string;

  @Required()
  @ObjectID('id')
  userId: string;

  @Property()
  address: UserAddressSchema;

  @Required()
  @Property()
  name: string;

  @Property()
  surname: string;

  @Required()
  @Property()
  password: string;

  @Required()
  @Email()
  @Property()
  email: string;

  @Property()
  numberOrder: Array<{ isValidate: boolean; madeAt: string }>;

  @Property()
  @Description('Last modification date')
  updatedAt: string;

  @Property()
  @Allow(null)
  @Description('JWT set for auth')
  token: string;
}
