import { Country } from '@angular-material-extensions/select-country';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'ng-shopping-cart';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { environment } from '../../../environments/environment';
import { Transporter } from '../../core/enum/transporter.enum';
import { CartItemCustom } from '../../core/models/cartItemCustom.model';
import { Config } from '../../core/models/config.model';
import { ConfigTransporter } from '../../core/models/configTransporter.model';
import { User } from '../../core/models/user.model';
import { ConfigService } from '../../core/services/config.service';
import { UserOrderedService } from '../../core/services/user-ordered.service';
import { UserService } from '../../core/services/user.service';
import { roundToTwoDigitsAfterComma } from '../../core/utils/number.utils';
import { RemoveNullUndefined } from '../../core/utils/removeNullUndefined';
import { ConnectModalComponent } from '../../shared/modal/connect-modal/connect-modal.component';
import { MatStepper } from '@angular/material/stepper';
import { IReminderReduction } from '../reminder-cart/reminder-cart.component';
declare const Stripe: any;
export interface IListOrderInterface {
  userId: string;
  userEmail: string;
  product: Array<{
    productName: string;
    quantity: number;
    grammeNumber: number | boolean;
  }>;
  reduction: { isReduction: boolean; type: string };
  shipment: Transporter;
}

@Component({
  selector: 'app-form-process-order',
  templateUrl: './form-process-order.component.html',
  styleUrls: ['./form-process-order.component.scss'],
})
export class FormProcessOrderComponent implements OnInit {
  private _onDestroy$ = new Subject();
  public connectionForm: FormGroup;
  public addressForm: FormGroup;
  public transporterForm: FormGroup;
  public payForm: FormGroup;
  public hide: boolean;
  public emailAlreadyUse: boolean = false;
  public isConnected: boolean;
  public user: User;
  public total: number = 0;
  public transporter: ConfigTransporter[];
  public configuration: Config;
  public reduction: number;
  public isDisabled: boolean = true;
  public cardError: string = '';
  public isCardError: boolean = false;
  public card: any;
  public stripe: any;
  public spinnerHidden: boolean = true;
  public paymentValidate: boolean = false;
  public secretStrip: {
    clientSecret: string | null;
  };
  public styleCard = {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#32325d',
      },
    },
    invalid: {
      fontFamily: 'Arial, sans-serif',
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  };
  public predefinedCountries: Country[] = [
    {
      name: 'Allemagne',
      alpha2Code: 'DE',
      alpha3Code: 'DEU',
      numericCode: '276',
    },
    {
      name: 'France',
      alpha2Code: 'FR',
      alpha3Code: 'FRA',
      numericCode: '250',
    },
    {
      name: 'Belgique',
      alpha2Code: 'BE',
      alpha3Code: 'BEL',
      numericCode: '056',
    },
    {
      name: 'Espagne',
      alpha2Code: 'ES',
      alpha3Code: 'ESP',
      numericCode: '300',
    },
    {
      name: 'Italie',
      alpha2Code: 'IT',
      alpha3Code: 'ITA',
      numericCode: '400',
    },
    {
      name: 'Grande Bretagne',
      alpha2Code: 'GB',
      alpha3Code: 'GBA',
      numericCode: '300',
    },
  ];

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private readonly _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private _configurationService: ConfigService,
    private _cartService: CartService<CartItemCustom>,
    private _userOrderedService: UserOrderedService
  ) {}

  async ngOnInit(): Promise<any> {
    this.connectionForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.addressForm = this._formBuilder.group({
      surname: [
        this.user?.surname ? this.user.surname : '',
        Validators.required,
      ],
      name: [this.user?.name ? this.user.name : '', Validators.required],
      address: [
        this.user?.address?.street ? this.user.address.street : '',
        Validators.required,
      ],
      postalCode: [
        this.user?.address?.postalCode ? this.user.address.postalCode : '',
        Validators.required,
      ],
      town: [
        this.user?.address?.town ? this.user.address.town : '',
        Validators.required,
      ],
      country: [
        this.user?.address?.country ? this.user.address.country : '',
        Validators.required,
      ],
    });
    this.transporterForm = this._formBuilder.group({
      transporter: ['', Validators.required],
    });
    this.payForm = this._formBuilder.group({
      name: ['', Validators.required],
    });
    const reduction = this._getSessionReduction();
    if (reduction) {
      this.reduction = roundToTwoDigitsAfterComma(
        this.total * (reduction.reduction / 100)
      );
      this.total = roundToTwoDigitsAfterComma(this.total - this.reduction);
    }
    this.configuration = await this._configurationService.getConfig();
    this.transporter = this.configuration?.transporter;
    this.hide = true;
    this.isConnected = this._userService.isLoggedIn();
    if (this._userService.getToken()) {
      this.user = await this._userService.findByToken();
      console.log(this.user);
    }
    this.stripe = Stripe(environment.stripeApiKey);

    const elements = this.stripe.elements();

    this.card = elements.create('card', {
      hidePostalCode: true,
      style: this.styleCard,
    });
    this.card.mount('.mat-step #card-element');
    this.card.on('change', (e) => {
      if (!e.empty) {
        this.payForm.enabled;
        this.isDisabled = false;
      } else if (e.error) {
        this.isCardError = true;
        this.cardError = e.error;
      }
    });
  }
  public connectModal() {
    this._matDialog
      .open(ConnectModalComponent)
      .afterClosed()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(
        async (res: any): Promise<any> => {
          if (res?.user) {
            this.user = res?.user;
            this.isConnected = true;
            this.goForward();
            return;
          } else if (this._userService.isLoggedIn()) {
            this.isConnected = true;
            this.goForward();
          }
          return;
        }
      );
  }

  public goForward() {
    this.stepper.linear = false;
    this.stepper.next();
    setTimeout(() => {
      this.stepper.linear = true;
    });
  }

  public async validateConnectionForm() {
    if (
      !this.connectionForm.get('email').value ||
      !this.connectionForm.get('password').value ||
      this._userService.isLoggedIn()
    ) {
      return;
    }
    const user: User = new User({
      email: this.connectionForm.get('email').value,
      password: this.connectionForm.get('password').value,
    });
    try {
      await this._userService.registerUser(
        RemoveNullUndefined.removeNullOrUndefined(user)
      );
      this._snackBar.open('Vous êtes Inscrit', 'Succès', {
        duration: 2000,
        panelClass: 'success-dialog',
      });
      this.isConnected = true;
    } catch (err) {
      if (err.status === 401 && err?.error?.message === 'email already use') {
        this.emailAlreadyUse = true;
        return;
      }
      this._snackBar.open('Votre authentification a échoué', 'Erreur', {
        duration: 2000,
        panelClass: 'error-dialog',
      });
    }
  }

  public async validateAddressForm() {
    if (this._userService.getToken()) {
      this.user = await this._userService.findByToken();
    }
    const user: User = new User({
      email: this.connectionForm.get('email').value || this.user.email,
      token: this._userService.getToken(),
      name: this.addressForm.get('name').value,
      surname: this.addressForm.get('surname').value,
      address: {
        town: this.addressForm.get('town').value,
        street: this.addressForm.get('address').value,
        postalCode: this.addressForm.get('postalCode').value,
        country: this.addressForm.get('country').value?.name,
      },
    });
    try {
      this.user = await this._userService.saveUser(
        RemoveNullUndefined.removeNullOrUndefined(user)
      );
      this._snackBar.open('Votre adresse est enregistré', 'Succès', {
        duration: 2000,
        panelClass: 'success-dialog',
      });
    } catch (err) {
      this._snackBar.open(
        "L'enregistrement de votre adresse a échoué",
        'Erreur',
        {
          duration: 2000,
          panelClass: 'error-dialog',
        }
      );
    }
  }

  public async onPaymentMethod() {
    const reduction = this._getSessionReduction();
    if (this._userService.getToken()) {
      this.user = await this._userService.findByToken();
    }
    const order: IListOrderInterface = {
      userId: this.user.userId,
      userEmail: this.user.email,
      product: [],
      reduction: {
        isReduction: reduction?.promotionActive
          ? reduction?.promotionActive
          : false,
        type: reduction?.reductionCode ? reduction?.reductionCode : '',
      },
      shipment: this.transporterForm?.value?.transporter,
    };
    this._cartService.getItems().forEach((v) => {
      order.product.push({
        productName: v.label,
        quantity: v.amount,
        grammeNumber: v.grammeNumber,
      });
    });
    try {
      this.spinnerHidden = false;
      this.secretStrip = await this._userOrderedService.intentPayment(order);
      const paymentIntent = await this.stripe.confirmCardPayment(
        this.secretStrip?.clientSecret,
        {
          payment_method: {
            card: this.card,
          },
        }
      );
      this.spinnerHidden = true;
      console.log(paymentIntent);
      if (paymentIntent?.paymentIntent?.status === 'succeeded') {
        this.paymentValidate = true;
      } else if (paymentIntent.error) {
        this._snackBar.open('Votre paiement a échoué', 'Erreur', {
          duration: 3000,
          panelClass: 'error-dialog',
        });
        this.isCardError = true;
        this.cardError = paymentIntent?.error?.message;
      }
    } catch (err) {
      this.spinnerHidden = true;
      console.log(err);
      this._snackBar.open(
        'Votre paiement a échoué, contacté votre banque',
        'Erreur',
        {
          duration: 3000,
          panelClass: 'error-dialog',
        }
      );
    }
  }

  public isConnectedSSO(connect: { connection: boolean }) {
    if (connect?.connection) {
      return this.goForward();
    } else {
      return;
    }
  }

  private _getSessionReduction(): IReminderReduction {
    const reduction = localStorage.getItem('reduction');
    return JSON.parse(reduction);
  }
}
