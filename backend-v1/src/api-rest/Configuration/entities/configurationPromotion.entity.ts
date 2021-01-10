import { Integer, Property } from '@tsed/schema';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ConfigurationEntity } from './configuration.entity';

@Entity({ name: 'configuration_promotion' })
export class ConfigurationPromotionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', nullable: true, default: true })
  @Property()
  isPromotion?: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Property()
  codePromotion?: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  @Property()
  @Integer()
  promotionReduction: number;

  @ManyToOne(() => ConfigurationEntity, configuration => configuration.promotion)
  configuration?: ConfigurationEntity;
}
