import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderCartWrapperComponent } from './order-cart-wrapper/order-cart-wrapper.component';

// @ts-ignore
const routes: Routes = [
  {
    path: 'panier',
    component: OrderCartWrapperComponent,
    data: {
      breadcrumb: 'Votre panier',
    },
  },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(
  routes
);
