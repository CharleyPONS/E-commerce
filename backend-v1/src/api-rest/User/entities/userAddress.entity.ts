import { Integer, Property, Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_address' })
export class UserAddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Property()
  @Column({ type: 'varchar', nullable: true })
  town: string;

  @Required()
  @Property()
  @Column({ type: 'varchar', nullable: true })
  street: string;

  @Required()
  @Property()
  @Integer()
  @Column({ type: 'int', nullable: true })
  numberStreet: number;

  @Required()
  @Property()
  @Integer()
  @Column({ type: 'int', nullable: true })
  postalCode: number;

  @Required()
  @Property()
  @Column({ type: 'varchar', nullable: true })
  country: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;
}
