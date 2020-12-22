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
  @Allow(null)
  @Column({ type: 'int', nullable: true })
  cbdRate?: number;

  @Minimum(0)
  @Maximum(1)
  @Allow(null)
  @Column({ type: 'int', nullable: true })
  thcRate?: number;

  @Column({ type: 'varchar', length: '255' })
  @Description('Last modification date')
  dateUpdate: string;

  @Description('Depending on the product in stock we add the right unity of measure')
  @OneToOne(() => ProductStockEntity, { cascade: true })
  @JoinColumn()
  stock?: ProductStockEntity;
  @BeforeInsert()
  @BeforeUpdate()
  private updateDates() {
    this.dateUpdate = new Date().toUTCString();
  }
}
