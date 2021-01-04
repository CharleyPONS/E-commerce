import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Categories } from '../../core/enum/categories.enum';
import { Product } from '../../core/models/product.model';
import { ProductAdded } from '../../core/models/productAdded.model';
import { ProductAddedComponent } from '../../shared/modal/product-added/product-added.component';

@Component({
  selector: 'app-product-details-wrapper',
  templateUrl: './product-details-wrapper.component.html',
  styleUrls: ['./product-details-wrapper.component.scss'],
})
export class ProductDetailsWrapperComponent
  implements OnChanges, OnDestroy, OnInit {
  @Input() product: Product;
  public form: FormGroup;
  public Categories: typeof Categories = Categories;
  public setGrammeQuantity: boolean = false;
  public priceForThree: number;
  public priceForFive: number;
  public priceForTen: number;
  private _onDestroy$ = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private readonly _matDialog: MatDialog,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.product) {
      this.priceForThree = Math.round(
        this.product?.price?.priceForThreeGramme / 3
      );
      this.priceForFive = Math.round(
        this.product?.price?.priceForFiveGramme / 5
      );
      this.priceForTen = Math.round(
        this.product?.price?.priceForTenGramme / 10
      );
    }
  }
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      grammeQuantity: [1, Validators.required],
      inputCounter: [1],
    });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  public displayModalAddProduct(productAdded: ProductAdded) {
    if (productAdded.isAdded) {
      this._matDialog
        .open(ProductAddedComponent, {
          data: productAdded,
        })
        .afterClosed()
        .pipe(takeUntil(this._onDestroy$))
        .subscribe(
          async (res: any): Promise<any> => {
            if (res?.goCart) {
              return this._router.navigateByUrl('/order/panier');
            }
            if (!res?.close) {
              return;
            }
            return;
          }
        );
    }
  }
}
