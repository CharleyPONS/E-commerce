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
  },
  {
    path: 'flower/:flowerId',
    component: FlowerDetailsComponent,
  },
  {
    path: 'hash',
    component: HashComponent,
  },
  {
    path: 'hash/:hashId',
    component: FlowerDetailsComponent,
  },

  {
    path: 'e-liquides',
    component: LiquidComponent,
  },
  {
    path: 'e-liquides/:e-liquidesId',
    component: FlowerDetailsComponent,
  },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(
  routes
);
