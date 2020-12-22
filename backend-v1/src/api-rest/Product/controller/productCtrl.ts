import { Controller, Get, PathParams } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Returns, Summary } from '@tsed/schema';

import { ProductEntity } from '../entities/product.entity';
import { ProductRepository } from '../services/product.repository';

import { OfferCtrl } from './offerCtrl';

@Controller({
  path: '/product',
  children: [OfferCtrl]
})
export class ProductCtrl {
  constructor(private _productRepository: ProductRepository) {}

  @Get('/')
  @Summary('Return all Product')
  @(Returns(200, Array).Of(ProductEntity))
  async getAllProduct(): Promise<ProductEntity[]> {
    return this._productRepository.findAll();
  }

  @Get('/:id')
  @Summary('Return a Product from his ID')
  @(Returns(200).Description('Success'))
  async getProduct(@PathParams('id') id: number): Promise<ProductEntity[]> {
    const product = await this._productRepository.findById(id);
    if (product) {
      return product;
    }

    throw new NotFound('Product not found');
  }
}
