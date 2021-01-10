import {
  Allow,
  Description,
  Enum,
  Integer,
  Maximum,
  Minimum,
  Property,
  Required
} from '@tsed/schema';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { CATEGORIES } from './product.enum';
import { ProductPriceEntity } from './productPrice.entity';
import { ProductStockEntity } from './productStock.entity';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Property()
  @Column({ type: 'varchar', length: '255' })
  name: string;

  @Property()
  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Property()
  @Column({ type: 'varchar', nullable: true })
  mainDescription: string;

  @Column({ type: 'varchar', nullable: true })
  @Property()
  optionalDescription: string;
  @Required()
  @Property()
  @Enum(CATEGORIES)
  @Column({ type: 'varchar', length: '255' })
  categories: CATEGORIES;

  @OneToOne(() => ProductPriceEntity, { cascade: true })
  @Property()
  @JoinColumn()
  price: ProductPriceEntity;

  @Property()
  @Integer()
  @Minimum(0)
  @Maximum(80)
  @Column({ type: 'int', nullable: true })
  cbdRate?: number;

  @Property()
  @Column({ type: 'varchar', length: '255' })
  imagePath: string;

  @Property()
  @Integer()
  @Minimum(0)
  @Maximum(1)
  @Column({ type: 'int', nullable: true })
  thcRate?: number;

  @Property()
  @Description('Last modification date')
  @Column({ type: 'varchar', length: '255' })
  dateUpdate: string;

  @Description('Depending on the product in stock we add the right unity of measure')
  @Property()
  @OneToOne(() => ProductStockEntity, { cascade: true })
  @JoinColumn()
  stock: ProductStockEntity;
  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
