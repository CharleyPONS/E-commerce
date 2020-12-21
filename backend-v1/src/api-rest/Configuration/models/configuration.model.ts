import { Enum, Property, Required } from '@tsed/schema';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuthMethod } from './authMethod.enum';
import { Transporter } from './transporter.enum';

@Entity()
export class ConfigurationModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Column({ type: 'simple-array' })
  @Enum(AuthMethod)
  auth: AuthMethod[];

  @Required()
  @Column({ type: 'simple-array' })
  @Enum(Transporter)
  transporter: Transporter[];

  @Property()
  @Column({ type: 'boolean' })
  isPromotion?: boolean;

  @Property()
  @Column({ type: 'boolean' })
  sponsorship?: boolean;

  @Property()
  @Column({ type: 'varchar' })
  dueDatePromotion?: string;

  @Property()
  @Column({ type: 'varchar' })
  dueDateSponsorship?: string;
}
