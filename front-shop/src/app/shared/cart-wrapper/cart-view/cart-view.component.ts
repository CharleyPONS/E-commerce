import { Component, OnInit } from '@angular/core';
import { CartViewDisplay, CartService } from 'ng-shopping-cart';
import { CartItemCustom } from '../../../core/models/cartItemCustom.model';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss'],
})
export class CartViewComponent implements OnInit {
  public display: CartViewDisplay = 'responsive-table';
  public tax = 0;
  public shipping = 0;
  public showImages = true;
  public useCustom = false;
  constructor(private _cartService: CartService<CartItemCustom>) {}

  ngOnInit(): void {
    this.tax = this._cartService.getTaxRate();
    this.shipping = this._cartService.getShipping();
  }
}
