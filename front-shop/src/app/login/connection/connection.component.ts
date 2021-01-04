import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { RemoveNullUndefined } from '../../core/utils/removeNullUndefined';
import set = Reflect.set;

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent implements OnInit {
  @Input() isOnOrder: boolean = false;
  @Output() connect = new EventEmitter<{ connect: boolean }>();
  public form: FormGroup;
  public resetForm: FormGroup;
  public hide: boolean;
  public authenticateSucceed: boolean = true;
  public isConnected: boolean;
  public matcher: any;
  public userRetrieve: User;
  public isForgotPassword: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isConnected = this._userService.isLoggedIn();
    this.hide = true;
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.resetForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public async save(): Promise<any> {
    const user: User = new User({
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    });
    try {
      this.userRetrieve = await this._userService.connectUser(
        RemoveNullUndefined.removeNullOrUndefined(user)
      );
      this.authenticateSucceed = this._userService.isLoggedIn();
      this.connect.emit({ connect: true });

      this._snackBar.open('Vous êtes connecté', 'Succès', {
        duration: 2000,
        panelClass: 'success-dialog',
      });
    } catch (err) {
      this._snackBar.open('Votre authentification a échoué', 'Erreur', {
        duration: 2000,
        panelClass: 'error-dialog',
      });
    }
    return;
  }

  public isConnectedSSO(connect: { connection: boolean }) {
    if (connect?.connection) {
      this.connect.emit({ connect: true });
    } else {
      return;
    }
  }

  public forgotPassword() {
    this.isForgotPassword = true;
  }

  public async changePassword() {
    const user: User = new User({
      email: this.resetForm.get('email').value,
    });
    try {
      await this._userService.resetPassword(user.email);
    } catch (err) {
      if (err.status === 404) {
        console.log();
      }
    }
  }
}
