import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ConfigurationEntity } from './configuration.entity';
import { Transporter } from './transporter.enum';
import { Enum, Integer, Property } from '@tsed/schema';

@Entity({ name: 'configuration_transporter' })
export class ConfigurationTransporterEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', nullable: true })
  @Property()
  @Enum(Transporter)
  type: Transporter;

  @Column({ type: 'int', nullable: true })
  @Property()
  @Integer()
  basePrice: number;

  @Column({ type: 'varchar', nullable: true })
  @Property()
  delay?: string;

  @ManyToOne(() => ConfigurationEntity, configuration => configuration.transporter)
  configuration?: ConfigurationEntity;
}
