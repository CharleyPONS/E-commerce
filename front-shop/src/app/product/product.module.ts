import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FlowerComponent } from './flower/flower.component';
import { routing } from './product.routing';

@NgModule({
  declarations: [FlowerComponent],
  imports: [CommonModule, routing, CommonModule, SharedModule],
  exports: [],
  providers: [],
})
export class ProductModule {}
