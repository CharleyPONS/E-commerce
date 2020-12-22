import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AuthMethod } from './authMethod.enum';
import { ConfigurationType } from './configurationType.enum';
import { Transporter } from './transporter.enum';

@Entity({ name: 'base_configuration' })
export class ConfigurationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-array', nullable: true})
  auth: AuthMethod[];

  @Column({ type: 'varchar' })
  configurationType: ConfigurationType;

  @Column({ type: 'simple-array' })
  transporter: Transporter[];

  @Column({ type: 'boolean', nullable: true, default: true })
  isPromotion?: boolean;

  @Column({ type: 'int', nullable: true, default: 0 })
  promotionReduction?: number;

  @Column({ type: 'boolean', nullable: true, default: true })
  sponsorship?: boolean;

  @Column({ type: 'varchar', nullable: true })
  dueDatePromotion?: string;

  @Column({ type: 'varchar', nullable: true })
  dueDateSponsorship?: string;
}
