import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'ng-shopping-cart';
import { CartItemCustom } from '../../../core/models/cartItemCustom.model';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent implements OnInit {
  public icon: string;
  public itemsText: string;
  public noItemsText: string;
  public manyItemsText: string;
  public product: number = 0;

  constructor(
    private _router: Router,
    private _cartService: CartService<CartItemCustom>
  ) {}

  ngOnInit(): void {
    this.icon = '../../../assets/shopping_bag.svg';
    this.itemsText = '';
    this.noItemsText = '';
    this.manyItemsText = '';
    this.product = this._cartService.getItems()?.length;
    this._cartService.onItemsChanged.subscribe(() => {
      this.product = this._cartService.getItems()?.length;
    });
  }

  public async goCart(): Promise<any> {
    await this._router.navigateByUrl('/order/panier');
  }
}
