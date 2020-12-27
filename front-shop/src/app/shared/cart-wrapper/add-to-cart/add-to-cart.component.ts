import {
  Component,
  OnInit,
  SimpleChanges,
  OnChanges,
  Input,
} from '@angular/core';
import { CartItemCustom } from '../../../core/models/cartItemCustom.model';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnChanges, OnInit {
  @Input() positionButton: string;
  @Input() cartItemValue: CartItemCustom;
  public cartItem: CartItemCustom;
  public custom: boolean = false;
  public type: string = 'button';
  public position: string;
  public buttonText: string = 'Ajouter au panier';
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.cartItemValue) {
      this.addToCart(this.cartItemValue);
    }
  }
  ngOnInit(): void {
    this.position = this.positionButton || 'right';
  }

  public addToCart(item) {
    console.log(item);
    return this.cartItemValue;
  }
}
