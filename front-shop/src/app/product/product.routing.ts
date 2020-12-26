import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowerComponent } from './flower/flower.component';

// @ts-ignore
const routes: Routes = [
  {
    path: 'flower',
    component: FlowerComponent,
    data: {},
  },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(
  routes
);
