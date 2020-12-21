import { Required } from '@tsed/schema';
import { BeforeInsert, BeforeUpdate, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../../User/models/user.entity';

// Use save in place of update to apply hook middleware

export class UserOrderedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255' })
  billId?: string;

  @Column({ type: 'boolean' })
  paid?: boolean;

  @Required()
  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', length: '255' })
  dateUpdate: string;

  @Column({ type: 'int' })
  @ManyToOne(() => UserEntity, user => user.userOrder)
  user: UserEntity;
  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
