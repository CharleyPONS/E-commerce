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
  auth: AuthMethod[];

  @Column({ type: 'varchar' })
  configurationType: ConfigurationType;

  @OneToMany(
    () => ConfigurationTransporterEntity,
    configurationTransporter => configurationTransporter.configuration,
    { cascade: true }
  )
  transporter: ConfigurationTransporterEntity[];

  @OneToMany(
    () => ConfigurationPromotionEntity,
    configurationPromotion => configurationPromotion.configuration,
    { cascade: true }
  )
  promotion?: ConfigurationPromotionEntity[];

  @Column({ type: 'int', nullable: true })
  minPriceFreeShipment: number;

  @Column({ type: 'int', nullable: true })
  baseShipmentPrice?: number;

  @Column({ type: 'boolean', nullable: true, default: true })
  sponsorship?: boolean;

  @Column({ type: 'varchar', nullable: true })
  dueDateSponsorship?: string;
}
