import { BodyParams, Context, Controller, Get, Post } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Returns, Summary } from '@tsed/schema';

import { config } from '../../../core/config';
import { $logger } from '../../../core/services/customLogger';
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
  @(Returns(200, ConfigurationEntity).Description('returns configuration'))
  async getConfiguration(@Context() ctx: Context): Promise<ConfigurationEntity> {
    $logger.info('Retrieve configuration');
    const configuration: ConfigurationEntity = await this._configurationRepository.findByType(
      config.CONFIGURATION_TYPE as ConfigurationType
    );
    if (!configuration) {
      $logger.warn('Configuration not provided on DB');
      throw new NotFound('No configuration provided on the DB');
    }
    return configuration;
  }
  @Post('/reduction')
  @Summary('Verify offer of client')
  @(Returns(200).Description('Control if reduction is authorized'))
  async checkReduction(@BodyParams() offerCode: { code: string }): Promise<any> {
    const configuration: ConfigurationEntity[] = await this._configurationRepository.findByType(
      config.CONFIGURATION_TYPE as ConfigurationType
    );
    if (
      offerCode.code &&
      configuration[0].promotion &&
      Array.isArray(configuration[0].promotion) &&
      configuration[0].promotion.find(v => v.codePromotion === offerCode.code && v.isPromotion)
    ) {
      $logger.info(`Code offer match`, { code: offerCode });

      return {
        isPromotion: true,
        promotionReduction: configuration[0].promotion.find(v => v.codePromotion === offerCode.code)
          ?.promotionReduction
      };
    }
    $logger.warn(`Code offer not match`, { code: offerCode.code });
    throw new NotFound('Promotion not found');
  }
}
