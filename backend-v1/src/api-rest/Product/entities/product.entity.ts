import { Allow, Description, Enum, Maximum, Minimum, Required } from '@tsed/schema';
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
  @Column({ type: 'varchar', length: '255' })
  name: string;

  @Required()
  @Column({ type: 'varchar', length: '255' })
  @Enum(CATEGORIES)
  categories: CATEGORIES;

  @OneToOne(() => ProductPriceEntity, { cascade: true })
  @JoinColumn()
  price: ProductPriceEntity;

  @Minimum(0)
  @Maximum(80)
  @Column({ type: 'int', nullable: true })
  cbdRate?: number;

  @Column({ type: 'varchar', length: '255' })
  imagePath: string;
  @Minimum(0)
  @Maximum(1)
  @Column({ type: 'int', nullable: true })
  thcRate?: number;

  @Column({ type: 'varchar', length: '255' })
  @Description('Last modification date')
  dateUpdate: string;

  @Description('Depending on the product in stock we add the right unity of measure')
  @OneToOne(() => ProductStockEntity, { cascade: true })
  @JoinColumn()
  stock: ProductStockEntity;
  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
