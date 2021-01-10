import { Context, Controller, Get, PathParams } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Returns, Summary } from '@tsed/schema';

import { ProductEntity } from '../entities/product.entity';
import { CATEGORIES } from '../entities/product.enum';
import { ProductRepository } from '../services/product.repository';
import { $logger } from '../../../core/services/customLogger';

@Controller({
  path: '/product'
})
export class ProductCtrl {
  constructor(private _productRepository: ProductRepository) {}

  @Get('/')
  @Summary('Return all Product')
  async getAllProduct(@Context() ctx: Context): Promise<ProductEntity[]> {
    const product: ProductEntity[] = await this._productRepository.findAll();
    return product;
  }

  @Get('/:category')
  @Summary('Return a Product from his ID')
  @(Returns(200, ProductEntity).Description('Success'))
  async getProduct(@PathParams('id') category: CATEGORIES): Promise<ProductEntity[]> {
    const product = await this._productRepository.findByCategories(category);
    if (!product) {
      $logger.warn('Product not found', { id: category });
      throw new NotFound('Product not found');
    }
    return product;
  }
}
