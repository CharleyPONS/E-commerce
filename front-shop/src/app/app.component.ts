import { Component, OnInit } from '@angular/core';
import { CartService } from 'ng-shopping-cart';
import { CartItemCustom } from './core/models/cartItemCustom.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front';
  constructor(private _cartService: CartService<CartItemCustom>) {}
  ngOnInit() {
    this._cartService.setLocaleFormat('€');
  }
}
