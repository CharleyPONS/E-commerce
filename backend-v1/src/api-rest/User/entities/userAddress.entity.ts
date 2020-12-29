import { Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_address' })
export class UserAddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Column({ type: 'varchar', nullable: true })
  town: string;

  @Required()
  @Column({ type: 'varchar', nullable: true })
  street: string;

  @Required()
  @Column({ type: 'int', nullable: true })
  numberStreet: number;

  @Required()
  @Column({ type: 'int', nullable: true })
  postalCode: number;

  @Required()
  @Column({ type: 'varchar', nullable: true })
  country: string;

  @Column({ type: 'uuid' })
  userId: string;
}
