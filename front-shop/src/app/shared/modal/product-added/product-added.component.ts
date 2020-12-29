import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartService } from 'ng-shopping-cart';
import { CartItemCustom } from '../../../core/models/cartItemCustom.model';

@Component({
  selector: 'app-product-added',
  templateUrl: './product-added.component.html',
  styleUrls: ['./product-added.component.scss'],
})
export class ProductAddedComponent implements OnInit {
  public productSelected: CartItemCustom;
  constructor(
    public dialogRef: MatDialogRef<ProductAddedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _cartService: CartService<CartItemCustom>
  ) {}

  ngOnInit(): void {
    this.productSelected = this._cartService.getItem(this.data.identifier);
  }

  public close() {
    this.dialogRef.close({ close: true });
  }

  public goCart() {
    this.dialogRef.close({ goCart: true });
  }
}
