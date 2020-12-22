import { EntityRepository, FindConditions, In, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { WinstonLogger } from '../../../core/services/winston-logger';
import { UserEntity } from '../../User/entities/user.entity';
import { ProductEntity } from '../entities/product.entity';
import { CATEGORIES } from '../entities/product.enum';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  $onInit() {}

  async findById(productId: number): Promise<ProductEntity[] | undefined> {
    try {
      new WinstonLogger().logger().info(`Search a product with id ${productId}`);
      const product: ProductEntity[] = await this.find({
        where: { id: productId },
        relations: ['stock', 'price']
      });
      return product;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a product with id ${productId} request failed`, { error: err });
    }
  }

  async findByCategories(categoriesSelected: CATEGORIES): Promise<ProductEntity[] | undefined> {
    try {
      new WinstonLogger().logger().info(`Search a product with id ${categoriesSelected}`);
      return this.find({ where: { categories: categoriesSelected } });
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a product with id ${categoriesSelected} request failed`, { error: err });
    }
  }

  async findManyProduct(product: string[]): Promise<ProductEntity[]> {
    new WinstonLogger().logger().info(`Search a list product ${product}`);
    return this.find({ where: { name: In(product) } });
  }

  async saveProduct(product: ProductEntity): Promise<void> {
    try {
      new WinstonLogger().logger().info(`Save product`, { product });
      await this.save(product);
      new WinstonLogger().logger().info(`Save product succeed`, { product });
    } catch (err) {
      new WinstonLogger().logger().warn(`Save a product with id request failed`, { error: err });
    }
  }

  async updateOne(
    filter: FindConditions<UserEntity>,
    updateQuery: QueryDeepPartialEntity<UserEntity>,
    product: ProductEntity
  ): Promise<any> {
    try {
      new WinstonLogger().logger().info(`update product`, { product });
      await this.update(filter, updateQuery);
      new WinstonLogger().logger().info(`Update product succeed`, { product });
    } catch (err) {
      new WinstonLogger().logger().warn(`Update a product with id request failed`, { error: err });
    }
  }

  async findAll(): Promise<ProductEntity[]> {
    new WinstonLogger().logger().info(`Find all product`);
    const product: ProductEntity[] = await this.find({ relations: ['stock', 'price'] });
    return product;
  }
}
