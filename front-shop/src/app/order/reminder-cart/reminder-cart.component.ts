import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'ng-shopping-cart';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Transporter } from '../../core/enum/transporter.enum';
import { CartItemCustom } from '../../core/models/cartItemCustom.model';
import { Config } from '../../core/models/config.model';
import { ConfigService } from '../../core/services/config.service';
import { roundToTwoDigitsAfterComma } from '../../core/utils/number.utils';
import { DisplayCartComponent } from '../../shared/modal/display-cart/display-cart.component';
import { ProductAddedComponent } from '../../shared/modal/product-added/product-added.component';

export interface IReminderReduction {
  reduction: number;
  reductionCode: string;
  promotionActive: boolean;
}
@Component({
  selector: 'app-reminder-cart',
  templateUrl: './reminder-cart.component.html',
  styleUrls: ['./reminder-cart.component.scss'],
})
export class ReminderCartComponent implements OnDestroy, OnInit {
  @Input() isOnProcessPayment: boolean = false;
  public configuration: Config;
  public form: FormGroup;
  public codeInvalid: boolean = false;
  public reduction: number;
  public totalWithoutShipping: number = 0;
  public total: number = 0;
  public initTotal: number = 0;
  public baseShipment: number = 0;
  public codeAlreadyApply: boolean = false;
  public minPriceFreeShipment: number;
  public products: CartItemCustom[];
  private _onDestroy$ = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private _configurationService: ConfigService,
    private _snackBar: MatSnackBar,
    private _cartService: CartService<CartItemCustom>,
    private readonly _matDialog: MatDialog
  ) {}

  async ngOnInit(): Promise<any> {
    this._cartService.onItemsChanged.subscribe(async (v) => {
      await this.onInit();
    });
    await this.onInit();
  }

  public async onInit() {
    this.products = this._cartService.getItems();
    this.configuration = await this._configurationService.getConfig();
    const baseShipment: number = this.configuration?.transporter.find(
      (v) => v.type === Transporter.LAPOSTE
    )?.basePrice;
    this.total = roundToTwoDigitsAfterComma(this._cartService.totalCost());
    if (this.total < this.configuration?.minPriceFreeShipment) {
      this._cartService.setShipping(baseShipment);
    } else {
      this._cartService.setShipping(0);
    }
    this.baseShipment = baseShipment;
    this.totalWithoutShipping = roundToTwoDigitsAfterComma(
      this._cartService.totalCost() - this._cartService.getShipping()
    );
    this.initTotal = roundToTwoDigitsAfterComma(
      this._cartService.totalCost() - baseShipment
    );
    const reduction = this._getSessionReduction();
    this.minPriceFreeShipment = roundToTwoDigitsAfterComma(
      this.configuration?.minPriceFreeShipment - this.total
    );
    if (reduction) {
      this.reduction = roundToTwoDigitsAfterComma(
        this.total * (reduction.reduction / 100)
      );
      this.total = roundToTwoDigitsAfterComma(this.total - this.reduction);
      this.totalWithoutShipping = roundToTwoDigitsAfterComma(
        this.totalWithoutShipping - this.reduction
      );
      this.form = this._formBuilder.group({
        reduction: [reduction.reductionCode, Validators.required],
      });
      this.minPriceFreeShipment = roundToTwoDigitsAfterComma(
        this.configuration?.minPriceFreeShipment - this.total
      );
    } else {
      this.form = this._formBuilder.group({
        reduction: ['', Validators.required],
      });
    }
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  public async validateForm() {
    try {
      const promotion: {
        isPromotion: boolean;
        promotionReduction: number;
      } = await this._configurationService.sendPromotionCode(
        this.form?.value?.reduction
      );
      const reduction = this._getSessionReduction();

      if (
        reduction &&
        reduction.reductionCode === this.form?.value?.reduction
      ) {
        this.codeAlreadyApply =
          reduction.reductionCode === this.form?.value?.reduction;
        return;
      }
      if (promotion.isPromotion && promotion.promotionReduction) {
        if (
          reduction &&
          reduction.reductionCode !== this.form?.value?.reduction
        ) {
          this._clearSessionStorageReduction();
        }
        this._setSessionReduction({
          reduction: promotion.promotionReduction,
          promotionActive: true,
          reductionCode: this.form?.value?.reduction,
        });
        this.codeInvalid = false;
        this.reduction = roundToTwoDigitsAfterComma(
          this.total * (promotion?.promotionReduction / 100)
        );
        this.totalWithoutShipping = roundToTwoDigitsAfterComma(
          this.totalWithoutShipping - this.reduction
        );
        this.total = roundToTwoDigitsAfterComma(this.total - this.reduction);
        this.minPriceFreeShipment = roundToTwoDigitsAfterComma(
          this.configuration?.minPriceFreeShipment - this.total
        );
        this._snackBar.open('Promotion appliqué avec succès', 'promo', {
          duration: 2000,
          panelClass: 'success-dialog',
        });
      } else {
        this.codeInvalid = true;
      }
    } catch (err) {
      this.codeInvalid = true;
    }
  }

  public showCart() {
    this._matDialog
      .open(DisplayCartComponent)
      .afterClosed()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(
        async (res: any): Promise<any> => {
          if (res?.close) {
            return;
          }
          return;
        }
      );
  }

  private _setSessionReduction(reduction: IReminderReduction) {
    if (!reduction) {
      return;
    }
    localStorage.setItem('reduction', JSON.stringify(reduction));
  }

  private _getSessionReduction(): IReminderReduction {
    const reduction = localStorage.getItem('reduction');
    return JSON.parse(reduction);
  }

  private _clearSessionStorageReduction() {
    localStorage.removeItem('reduction');
  }
}
