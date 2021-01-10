import { EntityRepository, Repository } from 'typeorm';

import { ConfigurationEntity } from '../entities/configuration.entity';
import { ConfigurationType } from '../entities/configurationType.enum';

@EntityRepository(ConfigurationEntity)
export class ConfigurationRepository extends Repository<ConfigurationEntity> {
  async findByType(type: ConfigurationType): Promise<any> {
    return this.find({
      where: { configurationType: type },
      relations: ['promotion', 'transporter']
    });
  }
}
