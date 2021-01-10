import { Allow, Description, Email, Integer, Property, Required } from '@tsed/schema';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  JoinColumn,
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

  @Property()
  @OneToOne(() => UserAddressEntity, { cascade: true, onUpdate: 'CASCADE' })
  @JoinColumn()
  address: UserAddressEntity;

  @Property()
  @Column({ type: 'varchar', length: '255', nullable: true })
  name: string;

  @Property()
  @Column({ type: 'varchar', length: '255', nullable: true })
  surname: string;

  @Property()
  @Column({ type: 'varchar', length: '255', nullable: true })
  password: string;

  @Property()
  @Column({ type: 'boolean', nullable: true })
  fromSSO: boolean;

  @Required()
  @Property()
  @Email()
  @Column({ type: 'varchar', length: '255' })
  email: string;

  @Property()
  @Integer()
  @Column({ type: 'int', nullable: true })
  numberOrder: number;

  @Property()
  @Column({ type: 'varchar', length: '255' })
  @Description('Last modification date')
  dateUpdate: string;

  @Property()
  @Column({ type: 'varchar', nullable: true })
  token: string | null;

  @Property()
  @Integer()
  @Column({ type: 'int', nullable: true })
  expiresIn: number;

  @BeforeInsert()
  @BeforeUpdate()
  private updateDatesAndSso() {
    this.dateUpdate = new Date().toUTCString();
    if (!this.fromSSO) {
      this.fromSSO = false;
    }
  }
}
