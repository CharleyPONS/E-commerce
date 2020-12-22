import { Allow, Enum, Property, Required } from '@tsed/schema';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AuthMethod } from './authMethod.enum';
import { ConfigurationType } from './configurationType.enum';
import { Transporter } from './transporter.enum';

@Entity()
export class ConfigurationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Column({ type: 'simple-array' })
  @Enum(AuthMethod)
  auth: AuthMethod[];

  @Required()
  @Column({ type: 'varchar' })
  @Enum(ConfigurationType)
  configurationType: ConfigurationType;

  @Required()
  @Column({ type: 'simple-array' })
  @Enum(Transporter)
  transporter: Transporter[];

  @Allow(null)
  @Column({ type: 'boolean' })
  isPromotion?: boolean;

  @Property()
  @Allow(null)
  @Column({ type: 'boolean' })
  sponsorship?: boolean;

  @Allow(null)
  @Column({ type: 'varchar' })
  dueDatePromotion?: string;

  @Allow(null)
  @Column({ type: 'varchar' })
  dueDateSponsorship?: string;
}
