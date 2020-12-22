import { Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity()
export class UserAddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Column({ type: 'varchar' })
  town: string;

  @Required()
  @Column({ type: 'varchar' })
  street: string;

  @Required()
  @Column({ type: 'int' })
  numberStreet: number;

  @Required()
  @Column({ type: 'int' })
  postalCode: number;

  @Required()
  @Column({ type: 'varchar' })
  country: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  userId: UserEntity;
}
