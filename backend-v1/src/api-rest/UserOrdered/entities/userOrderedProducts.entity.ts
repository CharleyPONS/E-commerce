import { Allow, Enum, Integer, Minimum, Property, Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CATEGORIES, UNITY } from '../../Product/entities/product.enum';

import { UserOrderedEntity } from './userOrdered.entity';

@Entity({ name: 'user_ordered_products' })
export class UserOrderedProductsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Property()
  @Enum(CATEGORIES)
  @Column({ type: 'varchar', length: '255', nullable: true })
  type: CATEGORIES;

  @Required()
  @Property()
  @Column({ type: 'varchar', length: '255' })
  productName: string;

  @Required()
  @Property()
  @Integer()
  @Column({ type: 'int' })
  quantity: number;

  @Required()
  @Property()
  @Enum(UNITY)
  @Column({ type: 'varchar' })
  unityMeasure: UNITY;

  @Property()
  @Integer()
  @Column({ type: 'int', nullable: true })
  grammeNumber: number;

  @ManyToOne(() => UserOrderedEntity, userOrdered => userOrdered.product)
  userOrder: UserOrderedEntity;
}
