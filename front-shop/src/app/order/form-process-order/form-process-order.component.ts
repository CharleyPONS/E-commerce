import { Country } from '@angular-material-extensions/select-country';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { RemoveNullUndefined } from '../../core/utils/removeNullUndefined';
import { ConnectModalComponent } from '../../shared/modal/connect-modal/connect-modal.component';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-form-process-order',
  templateUrl: './form-process-order.component.html',
  styleUrls: ['./form-process-order.component.scss'],
})
export class FormProcessOrderComponent implements OnInit {
  private _onDestroy$ = new Subject();
  public connectionForm: FormGroup;
  public addressForm: FormGroup;
  public hide: boolean;
  public emailAlreadyUse: boolean = false;
  public isConnected: boolean;
  public user: User;
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
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.hide = true;
    this.isConnected = this._userService.isLoggedIn();
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
            this.goForward();
            return;
          }
          return;
        }
      );
  }

  public goForward() {
    this.stepper.next();
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
      this._snackBar.open('Vous êtes connecté', 'Succès', {
        duration: 2000,
      });
    } catch (err) {
      this._snackBar.open('Votre authentification a échoué', 'Erreur', {
        duration: 2000,
      });
    }
  }

  public async validateAddressForm() {
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
      await this._userService.saveUser(
        RemoveNullUndefined.removeNullOrUndefined(user)
      );
      this._snackBar.open('Votre adresse est enregistré', 'Succès', {
        duration: 2000,
      });
    } catch (err) {
      this._snackBar.open(
        "L'enregistrement de votre adresse a échoué",
        'Erreur',
        {
          duration: 2000,
        }
      );
    }
  }
}
