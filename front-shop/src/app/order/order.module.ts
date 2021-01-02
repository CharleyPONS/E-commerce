import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartModule } from 'ng-shopping-cart';
import { FacebookConnectionComponent } from '../login/facebook-connection/facebook-connection.component';
import { LoginModule } from '../login/login.module';
import { ConnectModalComponent } from '../shared/modal/connect-modal/connect-modal.component';
import { DisplayCartComponent } from '../shared/modal/display-cart/display-cart.component';
import { SharedModule } from '../shared/shared.module';
import { routing } from './order.routing';
import { OrderCartWrapperComponent } from './order-cart-wrapper/order-cart-wrapper.component';
import { ReminderCartComponent } from './reminder-cart/reminder-cart.component';
import { WrapperProcessPaymentComponent } from './wrapper-process-payment/wrapper-process-payment.component';
import { FormProcessOrderComponent } from './form-process-order/form-process-order.component';

@NgModule({
  declarations: [
    OrderCartWrapperComponent,
    ReminderCartComponent,
    WrapperProcessPaymentComponent,
    FormProcessOrderComponent,
  ],
  imports: [
    CommonModule,
    routing,
    CommonModule,
    SharedModule,
    ShoppingCartModule,
    MatSelectCountryModule,
    LoginModule,
  ],
  entryComponents: [DisplayCartComponent, ConnectModalComponent],
  exports: [],
  providers: [],
})
export class OrderModule {}
