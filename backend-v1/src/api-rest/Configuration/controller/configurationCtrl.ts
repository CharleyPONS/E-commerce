import { BodyParams, Context, Controller, Get, Post } from '@tsed/common';
import { Returns, Summary } from '@tsed/schema';

import { WinstonLogger } from '../../../core/services/winstonLogger';
import { ConfigurationEntity } from '../entities/configuration.entity';
import { ConfigurationType } from '../entities/configurationType.enum';
import { ConfigurationRepository } from '../service/configuration.repository';

@Controller({
  path: '/configuration'
})
export class ConfigurationCtrl {
  constructor(private _configurationRepository: ConfigurationRepository) {}

  @Get('')
  @Summary('Return a User from his ID')
  async getConfiguration(@Context() ctx: Context): Promise<ConfigurationEntity> {
    new WinstonLogger().logger().info(`retreive configuration`);
    const data: ConfigurationEntity = await this._configurationRepository.findByType(
      process.env.CONFIGURATION_TYPE as ConfigurationType
    );
    return ctx.getResponse().status(200).send(data);
  }
  @Post('/reduction')
  @Summary('Verify offer of client')
  async checkReduction(
    @Context() ctx: Context,
    @BodyParams() offerCode: { code: string }
  ): Promise<any> {
    const config: ConfigurationEntity[] = await this._configurationRepository.findByType(
      process.env.CONFIGURATION_TYPE as ConfigurationType
    );
    if (
      offerCode.code &&
      config[0].promotion &&
      Array.isArray(config[0].promotion) &&
      config[0].promotion.find(v => v.codePromotion === offerCode.code && v.isPromotion)
    ) {
      new WinstonLogger().logger().info(`Code offer match`, { code: offerCode });

      return ctx
        .getResponse()
        .status(200)
        .send({
          isPromotion: true,
          promotionReduction: config[0].promotion.find(v => v.codePromotion === offerCode.code)
            ?.promotionReduction
        });
    }
    new WinstonLogger().logger().info(`Code offer not match`, { code: offerCode.code });
    return ctx.getResponse().status(404).send('Promotion not found');
  }
}
