import { Enum, Integer, Property } from '@tsed/schema';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AuthMethod } from './authMethod.enum';
import { ConfigurationPromotionEntity } from './configurationPromotion.entity';
import { ConfigurationTransporterEntity } from './configurationTransporter.entity';
import { ConfigurationType } from './configurationType.enum';

@Entity({ name: 'base_configuration' })
export class ConfigurationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-array', nullable: true })
  @Property()
  @Enum(AuthMethod)
  auth: AuthMethod[];

  @Column({ type: 'varchar' })
  @Property()
  @Enum(ConfigurationType)
  configurationType: ConfigurationType;

  @OneToMany(
    () => ConfigurationTransporterEntity,
    configurationTransporter => configurationTransporter.configuration,
    { cascade: true }
  )
  @Property()
  transporter: ConfigurationTransporterEntity[];

  @OneToMany(
    () => ConfigurationPromotionEntity,
    configurationPromotion => configurationPromotion.configuration,
    { cascade: true }
  )
  @Property()
  promotion?: ConfigurationPromotionEntity[];

  @Column({ type: 'int', nullable: true })
  @Property()
  @Integer()
  minPriceFreeShipment: number;

  @Column({ type: 'int', nullable: true })
  @Property()
  @Integer()
  baseShipmentPrice?: number;

  @Column({ type: 'boolean', nullable: true, default: true })
  @Property()
  sponsorship?: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Property()
  dueDateSponsorship?: string;
}
