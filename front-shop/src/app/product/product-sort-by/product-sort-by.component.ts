import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Product } from '../../core/models/product.model';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-product-sort-by',
  templateUrl: './product-sort-by.component.html',
  styleUrls: ['./product-sort-by.component.scss'],
})
export class ProductSortByComponent implements OnChanges, OnInit, OnDestroy {
  @Input() product: Product[];
  private cloneProduct: Product[];
  public form: FormGroup;
  private _onDestroy$ = new Subject();
  @Output() productSort = new EventEmitter();
  constructor(private _formBuilder: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    this.cloneProduct = cloneDeep(this.product);
  }
  ngOnInit(): void {
    this.cloneProduct = cloneDeep(this.product);
    this.form = this._formBuilder.group({
      sortBy: [''],
    });

    this.form.valueChanges.pipe(takeUntil(this._onDestroy$)).subscribe(() => {
      switch (this.form.value.sortBy) {
        case 1:
          this.sortByPriceIncreasing();
          break;
        case 2:
          this.sortByPriceDescending();
          break;
        case 3:
          this.sortByCBDDescending();
          break;

        case 4:
          this.sortByCBDIncreasing();
          break;
      }
      this.productSort.emit(this.cloneProduct);
    });
  }

  private sortByPriceDescending() {
    this.cloneProduct.sort((a, b) => {
      return b?.price?.basePrice - a?.price?.basePrice;
    });
  }

  private sortByCBDDescending() {
    this.cloneProduct.sort((a, b) => {
      return b?.cbdRate - a?.cbdRate;
    });
  }

  private sortByPriceIncreasing() {
    this.cloneProduct.sort((a, b) => {
      return a?.price?.basePrice - b?.price?.basePrice;
    });
  }

  private sortByCBDIncreasing() {
    this.cloneProduct.sort((a, b) => {
      return b?.cbdRate - a?.cbdRate;
    });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }
}
