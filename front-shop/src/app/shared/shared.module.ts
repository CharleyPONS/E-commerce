import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ShoppingCartModule } from 'ng-shopping-cart';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MaterialModule } from './material.module';
import { CartSummaryComponent } from './cart-wrapper/cart-summary/cart-summary.component';

@NgModule({
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    ShoppingCartModule,
  ],

  exports: [],
  providers: [],
  declarations: [MainLayoutComponent, CartSummaryComponent],
})
export class SharedModule {}
