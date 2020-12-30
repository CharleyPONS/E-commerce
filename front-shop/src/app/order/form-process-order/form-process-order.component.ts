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

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private readonly _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isConnected = this._userService.isLoggedIn();
    this.connectionForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(6)]],
    });
    this.addressForm = this._formBuilder.group({
      surname: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      town: ['', Validators.required],
      country: ['', Validators.required],
    });
  }
  public connectModal() {
    this._matDialog
      .open(ConnectModalComponent)
      .afterClosed()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(
        async (res: any): Promise<any> => {
          if (res?.close) {
            this.goForward(1);
            return;
          }
          return;
        }
      );
  }

  public goForward(step: number) {
    this.stepper.selectedIndex = step;
  }

  public async validateConnectionForm() {
    const user: User = new User({
      email: this.connectionForm.get('email').value,
      password: this.connectionForm.get('password').value,
    });
    try {
      await this._userService.connectUser(
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
      email: this.connectionForm.get('email').value,
      password: this.connectionForm.get('password').value,
      address: {
        town: this.addressForm.get('town').value,
        street: this.addressForm.get('address').value,
        postalCode: this.addressForm.get('postalCode').value,
        country: this.addressForm.get('country').value,
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
