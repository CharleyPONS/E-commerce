import { MatInputCounterModule } from '@angular-material-extensions/input-counter';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartModule } from 'ng-shopping-cart';
import { SharedModule } from '../shared/shared.module';
import { routing } from './order.routing';
import { OrderCartWrapperComponent } from './order-cart-wrapper/order-cart-wrapper.component';
import { ReminderCartComponent } from './reminder-cart/reminder-cart.component';

@NgModule({
  declarations: [OrderCartWrapperComponent, ReminderCartComponent],
  imports: [
    CommonModule,
    routing,
    CommonModule,
    SharedModule,
    ShoppingCartModule,
  ],
  exports: [],
  providers: [],
})
export class OrderModule {}
