import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderCartWrapperComponent } from './order-cart-wrapper/order-cart-wrapper.component';
import { WrapperProcessPaymentComponent } from './wrapper-process-payment/wrapper-process-payment.component';

// @ts-ignore
const routes: Routes = [
  {
    path: 'panier',
    component: OrderCartWrapperComponent,
    data: {
      breadcrumb: 'Votre panier',
    },
  },
  {
    path: 'validation',
    component: WrapperProcessPaymentComponent,
    data: {
      breadcrumb: 'Achat',
    },
  },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(
  routes
);
