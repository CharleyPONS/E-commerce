import { Context, Controller, Get, PathParams } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Returns, Summary } from '@tsed/schema';

import { ProductEntity } from '../entities/product.entity';
import { ProductRepository } from '../services/product.repository';

import { OfferCtrl } from './offerCtrl';
import { CATEGORIES } from '../entities/product.enum';

@Controller({
  path: '/product',
  children: [OfferCtrl]
})
export class ProductCtrl {
  constructor(private _productRepository: ProductRepository) {}

  @Get('/')
  @Summary('Return all Product')
  async getAllProduct(@Context() ctx: Context): Promise<ProductEntity[]> {
    const product: ProductEntity[] = await this._productRepository.findAll();
    return ctx.getResponse().status(200).send(product);
  }

  @Get('/:category')
  @Summary('Return a Product from his ID')
  @(Returns(200).Description('Success'))
  async getProduct(@PathParams('id') category: CATEGORIES): Promise<ProductEntity[]> {
    const product = await this._productRepository.findByCategories(category);
    if (product) {
      return product;
    }

    throw new NotFound('Product not found');
  }
}
