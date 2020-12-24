import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';

// @ts-ignore
const routes: Routes = [
  {
    path: '',
    component: MainWrapperComponent,
    data: {},
  },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(
  routes
);
