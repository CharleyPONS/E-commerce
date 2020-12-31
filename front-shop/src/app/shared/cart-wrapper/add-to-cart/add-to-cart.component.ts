import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'ng-shopping-cart';
import { CartItemCustom } from '../../../core/models/cartItemCustom.model';
import { Product } from '../../../core/models/product.model';
import { ProductAdded } from '../../../core/models/productAdded.model';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {
  @Input() positionButton: string;
  @Input() form: FormGroup;
  @Input() product: Product;
  @Output() productAdded = new EventEmitter<ProductAdded>();
  public items: CartItemCustom;
  public custom: boolean = false;
  public type: string = 'button';
  public position: string;
  public buttonText: string = 'Ajouter au panier';
  public quantity: number;
  constructor(
    private _cartService: CartService<CartItemCustom>,
    private _snackBar: MatSnackBar
  ) {
    this.items = new CartItemCustom();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes?.cartItemValue) {
  //     this.addToCart('');
  //   }
  // }
  ngOnInit(): void {
    this.position = this.positionButton || 'right';
    this.items = new CartItemCustom();
  }

  public addToCart(item) {
    if (item.identifier === 0) {
      this._cartService.removeItem(item.identifier);
    }
    console.log('added', item);
    this.setProductOrdered();
    this._cartService.addItem(this.items);
    this._cartService.setShipping(0);
    console.log(this._cartService.getShipping());
    if (this._cartService.getItem(this.items.identifier)) {
      this.productAdded.emit(
        new ProductAdded({ isAdded: true, identifier: this.items?.identifier })
      );
    }
    console.log('cart items', this._cartService.getItems());
  }

  public setProductOrdered(): void {
    this.items = new CartItemCustom();
    this.items.identifier = new Date().toString();
    this.items.label = this.product?.name;
    this.items.description = this.product?.mainDescription;
    this.items.cost = this._retrievePriceByBasePriceOrGramme(
      this.form?.value?.grammeQuantity
    );
    this.items.photo = this.product?.imagePath;
    this.items.amount = this.form?.value?.inputCounter || 1;
    this.quantity = this.form?.value?.inputCounter || 1;
    this.items.grammeNumber = this.form?.value?.grammeQuantity || false;
  }

  private _retrievePriceByBasePriceOrGramme(quantitySelected: any): number {
    let price: number = 0;
    if (!quantitySelected) {
      price = this.product?.price?.basePrice;
      return price;
    }
    switch (quantitySelected) {
      case 1:
        price = this.product?.price?.basePrice;
        break;
      case 3:
        price = this.product?.price?.priceForThreeGramme;
        break;
      case 5:
        price = this.product?.price?.priceForFiveGramme;
        break;
      case 10:
        price = this.product?.price?.priceForTenGramme;
        break;
    }
    return price;
  }
}
