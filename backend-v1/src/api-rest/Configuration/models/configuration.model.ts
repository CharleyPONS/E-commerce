import { Model, ObjectID } from '@tsed/mongoose';
import { Enum, Property, Required } from '@tsed/schema';

import { IdDb } from '../../../Core/models/enum/id-db.enum';

import { AuthMethod } from './authMethod.enum';
import { Transporter } from './transporter.enum';

@Model({
  connection: IdDb.SHOP_DATABASE,
  collection: 'configuration'
})
export class ConfigurationModel {
  @ObjectID('id')
  _id?: string;

  @Required()
  @Property()
  @Enum(AuthMethod)
  auth: AuthMethod[];

  @Required()
  @Property()
  @Enum(Transporter)
  transporter: Transporter[];

  @Property()
  isPromotion?: { active: boolean; dueDate: string };

  @Property()
  sponsorship?: { active: boolean; dueDate: string };
}
