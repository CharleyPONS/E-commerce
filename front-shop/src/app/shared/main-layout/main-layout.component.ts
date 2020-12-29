//TODO REFLECHIR A SPLI LE MENU EN DEUX AVEC ICONE PANIER ET MENU NAV
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'ng-shopping-cart';
import { CartItemCustom } from '../../core/models/cartItemCustom.model';
import { Config } from '../../core/models/config.model';
import { ConfigPromotion } from '../../core/models/configPromotion.model';
import { ConfigService } from '../../core/services/config.service';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';

export interface wrapperPromotion {
  isPromotion: boolean;
  promotion: number;
  codePromotion: string;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  public isConnected: boolean = false;
  public config: Config;
  public promotion: ConfigPromotion;
  constructor(
    private cartService: CartService<CartItemCustom>,
    private _userService: UserService,
    private _configService: ConfigService
  ) {}

  async ngOnInit(): Promise<any> {
    this.isConnected = this._userService.isLoggedIn();
    this.config = await this._configService.getConfig();
    this.promotion = this.config?.promotion?.find(
      (v) => v.codePromotion === environment.activePromotion
    );
  }
}
