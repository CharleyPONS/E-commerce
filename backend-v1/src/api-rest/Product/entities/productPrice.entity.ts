import { Description, Integer, Property, Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product_price' })
export class ProductPriceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Property()
  @Integer()
  @Description('base price for one unit or one gramme for cbd')
  @Column({ type: 'int' })
  basePrice: number;

  @Property()
  @Integer()
  @Column({ type: 'int', nullable: true })
  priceForThreeGramme: number;

  @Property()
  @Integer()
  @Column({ type: 'int', nullable: true })
  priceForFiveGramme: number;

  @Property()
  @Integer()
  @Column({ type: 'int', nullable: true })
  priceForTenGramme: number;

  @Property()
  @Column({ type: 'varchar', length: '255' })
  product: string;
}
