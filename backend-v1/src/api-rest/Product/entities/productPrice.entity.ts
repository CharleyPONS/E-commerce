import { Description, Required } from '@tsed/schema';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product_price' })
export class ProductPriceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Required()
  @Column({ type: 'int' })
  @Description('base price for one unit or one gramme for cbd')
  basePrice: number;

  @Column({ type: 'int', nullable: true })
  priceForThreeGramme: number;

  @Column({ type: 'int', nullable: true })
  priceForFiveGramme: number;

  @Column({ type: 'int', nullable: true })
  priceForTenGramme: number;

  @Column({ type: 'varchar', length: '255' })
  product: string;
}
