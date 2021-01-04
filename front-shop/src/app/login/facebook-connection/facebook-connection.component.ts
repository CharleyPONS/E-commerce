import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-facebook-connection',
  templateUrl: './facebook-connection.component.html',
  styleUrls: ['./facebook-connection.component.scss'],
})
export class FacebookConnectionComponent implements OnInit {
  @Input() isOnOrder: boolean = false;
  @Output() connectionProcess? = new EventEmitter<{ connect: boolean }>();
  constructor(
    private _userService: UserService,
    private _matSnackBar: MatSnackBar,
    private authService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.authService.authState.subscribe(
      async (user): Promise<any> => {
        if (!user) {
          return;
        }
        const userToken = await this._userService.saveUserSSO(user.authToken);
        if (userToken) {
          this._matSnackBar.open('Vous êtes connecté', 'succès', {
            duration: 2000,
          });
          this.connectionProcess.emit({ connect: true });
          return;
        }
      }
    );
  }

  public async facebookRedirection() {
    // A ce stade on balance juste sur facebook
    if (this._userService.isLoggedIn()) {
      this._matSnackBar.open('Vous êtes déjà connecté', 'info', {
        duration: 2000,
      });
      return;
    }
    const sign = await this._userService.signInWithFB();
  }
}
