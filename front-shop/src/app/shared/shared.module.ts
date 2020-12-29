import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShoppingCartModule } from 'ng-shopping-cart';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MaterialModule } from './material.module';
import { CartSummaryComponent } from './cart-wrapper/cart-summary/cart-summary.component';
import { AddToCartComponent } from './cart-wrapper/add-to-cart/add-to-cart.component';
import { ProductAddedComponent } from './modal/product-added/product-added.component';
import { CartViewComponent } from './cart-wrapper/cart-view/cart-view.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
  imports: [
    MaterialModule,
    RouterModule,
    ShoppingCartModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
  ],

  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    AddToCartComponent,
    CartSummaryComponent,
    ShoppingCartModule,
    CartViewComponent,
    BreadcrumbComponent,
  ],
  providers: [],
  declarations: [
    MainLayoutComponent,
    CartSummaryComponent,
    AddToCartComponent,
    ProductAddedComponent,
    CartViewComponent,
    BreadcrumbComponent,
  ],
})
export class SharedModule {}
