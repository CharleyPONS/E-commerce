import { Allow, Enum, Minimum, Property, Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CATEGORIES, UNITY } from '../../Product/entities/product.enum';

import { UserOrderedEntity } from './userOrdered.entity';

@Entity({ name: 'user_ordered_products' })
export class UserOrderedProductsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Column({ type: 'varchar', length: '255' })
  @Enum(CATEGORIES)
  type: CATEGORIES;

  @Required()
  @Column({ type: 'int' })
  @Minimum(2)
  amount: number;

  @Required()
  @Property()
  @Enum(UNITY)
  unityMeasure: UNITY;

  @Allow(null)
  @ManyToOne(() => UserOrderedEntity, userOrdered => userOrdered.product)
  userOrder: UserOrderedEntity;
}
