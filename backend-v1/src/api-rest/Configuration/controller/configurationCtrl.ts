import { Context, Controller, Get } from '@tsed/common';
import { Returns, Summary } from '@tsed/schema';

import { WinstonLogger } from '../../../core/services/winston-logger';
import { ConfigurationRepository } from '../service/configuration.repository';

@Controller({
  path: '/configuration'
})
export class ConfigurationCtrl {
  constructor(private _configurationRepository: ConfigurationRepository) {}

  @Get('')
  @Summary('Return a User from his ID')
  @(Returns(200).Description('get Config'))
  async getConfiguration(@Context() ctx: Context): Promise<void> {
    new WinstonLogger().logger().info(`retreive configuration`);
    return this._configurationRepository.find();
  }
}
