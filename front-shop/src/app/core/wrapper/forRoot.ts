import { ModuleWithProviders } from '@angular/core';
import { ShoppingCartModule } from 'ng-shopping-cart';
import { IShoppingCartConfig } from './shoppingCartConfig';

export class ForRoot {
  static forRootWrapper(
    config: IShoppingCartConfig
  ): ModuleWithProviders<ShoppingCartModule> {
    return {
      ngModule: ShoppingCartModule,
      providers: [{ provide: IShoppingCartConfig, useValue: config }],
    };
  }
}
