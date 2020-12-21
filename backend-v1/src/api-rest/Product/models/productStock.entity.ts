import { Enum, Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ProductEntity } from './product.entity';
import { UNITY } from './product.enum';

@Entity()
export class ProductStockEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Column({ type: 'int' })
  quantity: number;

  @Required()
  @Column({ type: 'varchar' })
  @Enum(UNITY)
  unityMeasure: UNITY;

  @Column({ type: 'int' })
  @OneToOne(() => ProductEntity, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn()
  product: ProductEntity;
}
