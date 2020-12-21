import { Allow, Description, Enum, Maximum, Minimum, Required } from '@tsed/schema';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { CATEGORIES } from './product.enum';
import { ProductPriceEntity } from './productPrice.entity';
import { ProductStockEntity } from './productStock.entity';

@Entity()
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Column({ type: 'varchar', length: '255' })
  name: string;

  @Required()
  @Column({ type: 'varchar', length: '255' })
  @Enum(CATEGORIES)
  categories: CATEGORIES;

  @Required()
  @Column()
  @OneToOne(() => ProductPriceEntity, { cascade: true })
  price: ProductPriceEntity;

  @Minimum(0)
  @Maximum(80)
  @Allow(null)
  @Column({ type: 'int' })
  cbdRate?: number;

  @Minimum(0)
  @Maximum(1)
  @Allow(null)
  @Column({ type: 'int' })
  thcRate?: number;

  @Column({ type: 'varchar', length: '255' })
  @Description('Last modification date')
  dateUpdate: string;

  @Column()
  @Description('Depending on the product in stock we add the right unity of measure')
  @OneToOne(() => ProductStockEntity, { cascade: true })
  stock?: ProductStockEntity;
  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
