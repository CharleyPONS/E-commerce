import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { RemoveNullUndefined } from '../../core/utils/removeNullUndefined';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  @Input() isOnOrder: boolean = false;
  @Output() connect = new EventEmitter<{ connect: boolean }>();
  public form: FormGroup;
  public hide: boolean;
  public isConnected: boolean;
  public authenticateSucceed: boolean = true;
  public emailAlreadyUse: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.isConnected = this._userService.isLoggedIn();
    this.hide = true;
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public async save(): Promise<any> {
    const user: User = new User({
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    });
    try {
      this.authenticateSucceed = await this._userService.registerUser(
        RemoveNullUndefined.removeNullOrUndefined(user)
      );
      this.connect.emit({
        connect: true,
      });
      this._snackBar.open('Vous êtes inscrit', 'Succès', {
        duration: 2000,
        panelClass: 'success-dialog',
      });
    } catch (err) {
      if (err.status === 401 && err?.error?.message === 'email already use') {
        this.emailAlreadyUse = true;
        return;
      } else {
        this.authenticateSucceed = false;
      }
    }
    return;
  }
}
