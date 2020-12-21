import { Allow, Description, Email, Property, Required } from '@tsed/schema';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { UserAddressEntity } from './userAddress.entity';
import { UserOrderedEntity } from '../../UserOrdered/models/userOrdered.entity';

// Use save in place of update to apply hook middleware
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @OneToOne(() => UserAddressEntity, { cascade: true })
  address: UserAddressEntity;

  @Required()
  @Column({ type: 'varchar', length: '255' })
  name: string;

  @Column({ type: 'varchar', length: '255' })
  surname: string;

  @Required()
  @Column({ type: 'varchar', length: '255' })
  password: string;

  @Required()
  @Email()
  @Column({ type: 'varchar', length: '255' })
  email: string;

  @Column({ type: 'int' })
  numberOrder: number;

  @Column({ type: 'varchar', length: '255' })
  @Description('Last modification date')
  dateUpdate: string;

  @Allow(null)
  @Column({ type: 'varchar', length: '255' })
  token: string;

  @Column()
  @OneToMany(() => UserOrderedEntity, userOrder => userOrder.user)
  userOrder: UserOrderedEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
