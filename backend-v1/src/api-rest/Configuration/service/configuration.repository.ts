import { Inject, Service } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';

import { WinstonLogger } from '../../../Core/services/winston-logger';
import { ConfigurationModel } from '../models/configuration.model';

@Service()
export class ConfigurationRepository {
  @Inject(ConfigurationModel)
  private configuration: MongooseModel<ConfigurationModel>;

  async find(): Promise<any> {
    try {
      const configurationDb = await this.configuration.find().exec();
      return configurationDb;
    } catch (err) {
      new WinstonLogger().logger().warn(`Error retrieve configuration`, { error: err });
    }
  }
}
