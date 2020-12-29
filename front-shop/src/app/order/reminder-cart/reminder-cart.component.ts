import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'ng-shopping-cart';
import { Transporter } from '../../core/enum/transporter.enum';
import { CartItemCustom } from '../../core/models/cartItemCustom.model';
import { Config } from '../../core/models/config.model';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-reminder-cart',
  templateUrl: './reminder-cart.component.html',
  styleUrls: ['./reminder-cart.component.scss'],
})
export class ReminderCartComponent implements OnInit {
  public configuration: Config;
  public form: FormGroup;
  public codeInvalid: boolean = false;
  public reduction: number;
  public totalWithoutShipping: number = 0;
  public total: number = 0;
  public baseShipment: number = 0;
  constructor(
    private _formBuilder: FormBuilder,
    private _configurationService: ConfigService,
    private _snackBar: MatSnackBar,
    private _cartService: CartService<CartItemCustom>
  ) {}

  async ngOnInit(): Promise<any> {
    this.configuration = await this._configurationService.getConfig();
    console.log(this.configuration);
    this.form = this._formBuilder.group({
      reduction: ['', Validators.required],
    });
    const baseShipment: number = this.configuration?.transporter.find(
      (v) => v.type === Transporter.LAPOSTE
    )?.basePrice;
    this._cartService.setShipping(baseShipment);
    this.baseShipment = baseShipment;
    this.totalWithoutShipping =
      this._cartService.totalCost() - this._cartService.getShipping();
    this.total = this._cartService.totalCost();
  }

  public async validateForm() {
    const promotion = await this._configurationService.sendPromotionCode(
      this.form?.value?.reduction
    );
    if (!promotion || !promotion?.ispromotion) {
      this.codeInvalid = false;
    } else {
      this.reduction = promotion?.promotionReduction;
      this._snackBar.open('Promotion appliqué avec succès', 'promo', {
        duration: 2000,
      });
    }
  }
}
