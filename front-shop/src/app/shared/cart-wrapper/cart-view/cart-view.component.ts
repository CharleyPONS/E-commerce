import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'ng-shopping-cart';
import { CartItemCustom } from '../../../core/models/cartItemCustom.model';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss'],
})
export class CartViewComponent implements OnInit {
  @Input() isOnProcessPayment: boolean = false;
  public display = 'responsive';
  public tax = 0;
  public shipping = 0;
  public showImages = true;
  public useCustom = false;
  public nameHeaderText = 'Nom du produit';
  public priceHeaderText = 'Prix';
  public quantityHeaderText = 'Quantité';
  public totalFooterText = 'Total';
  public shippingFooterText = 'Frais de livraison';
  public emptyText = 'Votre panier est vide';
  public numberItem: number = 0;
  public total: number = 0;

  constructor(private _cartService: CartService<CartItemCustom>) {}

  ngOnInit(): void {
    this.tax = this._cartService.getTaxRate();
    this.shipping = this._cartService.getShipping();
    this.numberItem = this._cartService.getItems()?.length;
    this.total =
      this._cartService.totalCost() - this._cartService.getShipping() || 0;
  }
}
