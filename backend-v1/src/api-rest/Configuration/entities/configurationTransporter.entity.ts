import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ConfigurationEntity } from './configuration.entity';
import { Transporter } from './transporter.enum';

@Entity({ name: 'configuration_transporter' })
export class ConfigurationTransporterEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', nullable: true })
  type: Transporter;

  @Column({ type: 'int', nullable: true })
  basePrice: number;

  @Column({ type: 'varchar', nullable: true })
  delay?: string;

  @ManyToOne(() => ConfigurationEntity, configuration => configuration.transporter)
  configuration?: ConfigurationEntity;
}
