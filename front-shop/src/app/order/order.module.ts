import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartModule } from 'ng-shopping-cart';
import { LoginModule } from '../login/login.module';
import { DisplayCartComponent } from '../shared/modal/display-cart/display-cart.component';
import { SharedModule } from '../shared/shared.module';
import { routing } from './order.routing';
import { OrderCartWrapperComponent } from './order-cart-wrapper/order-cart-wrapper.component';
import { ReminderCartComponent } from './reminder-cart/reminder-cart.component';
import { WrapperProcessPaymentComponent } from './wrapper-process-payment/wrapper-process-payment.component';

@NgModule({
  declarations: [
    OrderCartWrapperComponent,
    ReminderCartComponent,
    WrapperProcessPaymentComponent,
  ],
  imports: [
    CommonModule,
    routing,
    CommonModule,
    SharedModule,
    ShoppingCartModule,
    LoginModule,
  ],
  entryComponents: [DisplayCartComponent],
  exports: [],
  providers: [],
})
export class OrderModule {}
