import { EntityRepository, Repository } from 'typeorm';

import { WinstonLogger } from '../../../core/services/winston-logger';
import { ConfigurationEntity } from '../entities/configuration.entity';
import { ConfigurationType } from '../entities/configurationType.enum';

@EntityRepository(ConfigurationEntity)
export class ConfigurationRepository extends Repository<ConfigurationEntity> {
  async findByType(type: ConfigurationType): Promise<any> {
    try {
      return this.find({ where: { configurationType: type } });
    } catch (err) {
      new WinstonLogger().logger().warn(`Error retrieve configuration`, { error: err });
    }
  }
}
