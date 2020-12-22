import { Description, Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ProductEntity } from './product.entity';

@Entity()
export class ProductPriceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Required()
  @Column({ type: 'int' })
  @Description('base price for one unit or one gramme for cbd')
  basePrice: number;

  @Column({ type: 'int' })
  priceForThreeGramme: number;

  @Column({ type: 'int' })
  priceForFiveGramme: number;

  @Column({ type: 'int' })
  priceForTenGramme: number;

  @OneToOne(() => ProductEntity, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn()
  product: ProductEntity;
}
