import { Enum, Integer, Property, Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UNITY } from './product.enum';

@Entity({ name: 'product_stock' })
export class ProductStockEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Property()
  @Integer()
  @Column({ type: 'int' })
  quantity: number;

  @Required()
  @Enum(UNITY)
  @Property()
  @Column({ type: 'varchar' })
  unityMeasure: UNITY;

  @Column({ type: 'varchar', length: '255', nullable: true })
  product: string;
}
