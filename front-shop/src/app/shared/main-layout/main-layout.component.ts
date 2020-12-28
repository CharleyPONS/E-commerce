//TODO REFLECHIR A SPLI LE MENU EN DEUX AVEC ICONE PANIER ET MENU NAV
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'ng-shopping-cart';
import { CartItemCustom } from '../../core/models/cartItemCustom.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  public isConnected: boolean = false;
  constructor(
    private cartService: CartService<CartItemCustom>,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.isConnected = this._userService.isLoggedIn();
  }
}
