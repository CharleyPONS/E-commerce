import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { AppPreloadingStrategy } from './app.preloading-strategy';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    data: {
      title: 'Acceuil',
      breadcrumb: 'Acceuil',
    },
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginModule),
        data: {
          title: 'Connexion',
          breadcrumb: 'Connexion',
        },
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./product/product.module').then((m) => m.ProductModule),
        data: {
          title: 'Produit',
        },
      },
      {
        path: 'order',
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderModule),
        data: {
          title: 'Commande',
        },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: AppPreloadingStrategy,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
  providers: [AppPreloadingStrategy],
})
export class AppRoutingModule {}
