import { Allow, Description, Email, Required } from '@tsed/schema';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { UserOrderedEntity } from '../../UserOrdered/entities/userOrdered.entity';

import { UserAddressEntity } from './userAddress.entity';

// Use save in place of update to apply hook middleware
@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  userId: string;

  @OneToOne(() => UserAddressEntity, { cascade: true})
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
  token: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
