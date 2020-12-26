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

import { UserAddressEntity } from './userAddress.entity';

// Use save in place of update to apply hook middleware
@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  userId: string;

  @OneToOne(() => UserAddressEntity, { cascade: true })
  address: UserAddressEntity;

  @Column({ type: 'varchar', length: '255', nullable: true })
  name: string;

  @Column({ type: 'varchar', length: '255', nullable: true })
  surname: string;

  @Required()
  @Column({ type: 'varchar', length: '255' })
  password: string;

  @Required()
  @Email()
  @Column({ type: 'varchar', length: '255' })
  email: string;

  @Column({ type: 'int', nullable: true })
  numberOrder: number;

  @Column({ type: 'varchar', length: '255' })
  @Description('Last modification date')
  dateUpdate: string;

  @Column({ type: 'varchar', length: '255', nullable: true })
  token: string | null;

  @Column({ type: 'int', nullable: true })
  expiresIn: number;

  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
