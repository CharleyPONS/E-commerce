import { Enum, Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UNITY } from './product.enum';

@Entity({ name: 'product_stock' })
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

  @Column({ type: 'varchar', length: '255' })
  product: string;
}
