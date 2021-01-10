import { EntityRepository, FindConditions, In, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { $logger } from '../../../core/services/customLogger';
import { UserEntity } from '../../User/entities/user.entity';
import { ProductEntity } from '../entities/product.entity';
import { CATEGORIES } from '../entities/product.enum';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  $onInit() {}

  async findById(productId: number): Promise<ProductEntity[] | undefined> {
    $logger.info(`Search a product with id ${productId}`);
    return this.find({
      where: { id: productId },
      relations: ['stock', 'price']
    });
  }

  async findByCategories(categoriesSelected: CATEGORIES): Promise<ProductEntity[] | undefined> {
    $logger.info(`Search a product with id ${categoriesSelected}`);
    return this.find({ where: { categories: categoriesSelected } });
  }

  async findManyProduct(product: string[]): Promise<ProductEntity[]> {
    $logger.info(`Search a list product ${product}`);
    return this.find({ where: { name: In(product) }, relations: ['stock', 'price'] });
  }

  async saveProduct(product: ProductEntity): Promise<void> {
    $logger.info(`Save product`, { product });
    await this.save(product);
  }

  async updateOne(
    filter: FindConditions<UserEntity>,
    updateQuery: QueryDeepPartialEntity<UserEntity>,
    product: ProductEntity
  ): Promise<any> {
    try {
      $logger.info(`update product`, { product });
      await this.update(filter, updateQuery);
    } catch (err) {
      $logger.warn(`Update a product with id request failed`, { error: err });
    }
  }

  async findAll(): Promise<ProductEntity[]> {
    $logger.info(`Find all product`);
    return this.find({ relations: ['stock', 'price'] });
  }
}
