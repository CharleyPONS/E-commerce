import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuAccountComponent } from './menu-account/menu-account.component';
import { AccountUserComponent } from './account-user/account-user.component';
import { AccountUserOrderComponent } from './account-user-order/account-user-order.component';

@NgModule({
  declarations: [
    MenuAccountComponent,
    AccountUserComponent,
    AccountUserOrderComponent,
  ],
  imports: [CommonModule],
})
export class AccountModule {}
