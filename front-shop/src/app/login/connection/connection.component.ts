import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { RemoveNullUndefined } from '../../core/utils/removeNullUndefined';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent implements OnInit {
  @Input() isOnOrder: boolean = false;
  public form: FormGroup;
  public hide: boolean;
  public authenticateSucceed: boolean = true;
  public isConnected: boolean;
  public matcher: any;
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
  }

  public async save(): Promise<any> {
    const user: User = new User({
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    });
    try {
      this.authenticateSucceed = await this._userService.connectUser(
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

    if (!this.isOnOrder) {
      return this._router.navigateByUrl('/');
    }
    return;
  }
}
