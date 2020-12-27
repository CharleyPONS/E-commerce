import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FlowerComponent } from './flower/flower.component';
import { routing } from './product.routing';
import { ProductWrapperComponent } from './product-wrapper/product-wrapper.component';
import { ProductSortByComponent } from './product-sort-by/product-sort-by.component';
import { HashComponent } from './hash/hash.component';
import { LiquidComponent } from './liquid/liquid.component';
import { FlowerDetailsComponent } from './flower-details/flower-details.component';
import { HashDetailsComponent } from './hash-details/hash-details.component';
import { LiquidDetailsComponent } from './liquid-details/liquid-details.component';
import { ProductDetailsWrapperComponent } from './product-details-wrapper/product-details-wrapper.component';

@NgModule({
  declarations: [
    FlowerComponent,
    ProductWrapperComponent,
    ProductSortByComponent,
    HashComponent,
    LiquidComponent,
    FlowerDetailsComponent,
    HashDetailsComponent,
    LiquidDetailsComponent,
    ProductDetailsWrapperComponent,
  ],
  imports: [CommonModule, routing, CommonModule, SharedModule],
  exports: [],
  providers: [],
})
export class ProductModule {}
