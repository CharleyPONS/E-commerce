import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FlowerComponent } from './flower/flower.component';
import { routing } from './product.routing';
import { ProductWrapperComponent } from './product-wrapper/product-wrapper.component';
import { PageProductWrapperComponent } from './page-product-wrapper/page-product-wrapper.component';
import { ProductSortByComponent } from './product-sort-by/product-sort-by.component';

@NgModule({
  declarations: [
    FlowerComponent,
    ProductWrapperComponent,
    PageProductWrapperComponent,
    ProductSortByComponent,
  ],
  imports: [CommonModule, routing, CommonModule, SharedModule],
  exports: [],
  providers: [],
})
export class ProductModule {}
