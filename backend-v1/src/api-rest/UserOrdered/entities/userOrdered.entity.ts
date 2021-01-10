import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Transporter } from '../../Configuration/entities/transporter.enum';
import { UserOrderedProductsEntity } from './userOrderedProducts.entity';
import { Enum, Integer, Property } from '@tsed/schema';

// Use save in place of update to apply hook middleware

@Entity({ name: 'user_ordered' })
export class UserOrderedEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Property()
  @Column()
  @Generated('uuid')
  userOrderedId: string;

  @Property()
  @Integer()
  @PrimaryGeneratedColumn()
  billId?: number;

  @Property()
  @Column({ type: 'boolean' })
  paid?: boolean;

  @Property()
  @Integer()
  @Column({ type: 'real' })
  amount: number;

  @Property()
  @Enum(Transporter)
  @Column({ type: 'varchar', length: '255' })
  transporter: Transporter;

  @Property()
  @Column({ type: 'varchar', length: '255' })
  dateUpdate: string;

  @Property()
  @OneToMany(() => UserOrderedProductsEntity, userOrderedProduct => userOrderedProduct.userOrder, {
    cascade: true
  })
  product: UserOrderedProductsEntity[];

  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
