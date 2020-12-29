import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowerDetailsComponent } from './flower-details/flower-details.component';
import { FlowerComponent } from './flower/flower.component';
import { HashComponent } from './hash/hash.component';
import { LiquidComponent } from './liquid/liquid.component';

// @ts-ignore
const routes: Routes = [
  {
    path: 'flower',
    component: FlowerComponent,
    data: {
      breadcrumb: 'Nos fleurs',
    },
  },
  {
    path: 'flower/:flowerId',
    component: FlowerDetailsComponent,
    data: {
      firstBreadcrumb: 'Nos fleurs',
      breadcrumb: '',
    },
  },
  {
    path: 'hash',
    component: HashComponent,
    data: {
      breadcrumb: 'Nos Hash',
    },
  },
  {
    path: 'hash/:hashId',
    component: FlowerDetailsComponent,
    data: {
      firstBreadcrumb: 'Nos Hash',
      breadcrumb: '',
    },
  },

  {
    path: 'e-liquides',
    component: LiquidComponent,
    data: {
      breadcrumb: 'Nos e-liquides',
    },
  },
  {
    path: 'e-liquides/:e-liquidesId',
    component: FlowerDetailsComponent,
    data: {
      firstBreadcrumb: 'Nos e-liquides',
      breadcrumb: '',
    },
  },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(
  routes
);
