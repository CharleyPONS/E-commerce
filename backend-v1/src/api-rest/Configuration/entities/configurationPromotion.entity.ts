import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ConfigurationEntity } from './configuration.entity';

@Entity({ name: 'configuration_promotion' })
export class ConfigurationPromotionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', nullable: true, default: true })
  isPromotion?: boolean;

  @Column({ type: 'varchar', nullable: true })
  codePromotion?: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  promotionReduction?: number;

  @ManyToOne(() => ConfigurationEntity, configuration => configuration.promotion)
  configuration?: ConfigurationEntity;
}
