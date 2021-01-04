import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { map } from 'rxjs/internal/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private _http: HttpClient,
    private _snackBar: MatSnackBar,
    private authService: SocialAuthService
  ) {}
  public async connectUser(userBody: User): Promise<any> {
    if (this.isLoggedIn()) {
      this._snackBar.open('Vous êtes déjà connecté', 'Succès', {
        duration: 2000,
        panelClass: 'success-dialog',
      });
      return;
    }
    const user: User = await this._http
      .post<User>(
        `${environment.apiUrl}${environment.apiPath}/user/signIn`,
        userBody
      )
      .pipe(map((res) => new User(res)))
      .toPromise();
    this.setSession(user);
    return user;
  }

  public async registerUser(userBody: User): Promise<boolean> {
    if (this.isLoggedIn()) {
      this._snackBar.open('Vous êtes déjà connecté', 'Succès', {
        duration: 2000,
        panelClass: 'success-dialog',
      });
      return true;
    }
    const user: User = await this._http
      .post<User>(
        `${environment.apiUrl}${environment.apiPath}/signUp`,
        userBody
      )
      .pipe(map((res) => new User(res)))
      .toPromise();
    this.setSession(user);
    return this.isLoggedIn();
  }

  public async resetPassword(userEmail: string): Promise<void> {
    await this._http
      .post<string>(
        `${environment.apiUrl}${environment.apiPath}/user/forgotPassword`,
        { email: userEmail }
      )
      .toPromise();
  }

  public async saveUser(userBody: User): Promise<User> {
    const user: User = await this._http
      .post<User>(
        `${environment.apiUrl}${environment.apiPath}/user/save`,
        userBody
      )
      .pipe(map((res) => new User(res)))
      .toPromise();
    return user;
  }

  public async saveUserSSO(token: string): Promise<boolean> {
    const user: User = await this._http
      .post<User>(`${environment.apiUrl}${environment.apiPath}/user/oauth`, {
        ssoToken: token,
      })
      .pipe(map((res) => new User(res)))
      .toPromise();
    this.setSession(user);
    return this.isLoggedIn();
  }

  public async findByToken(): Promise<User> {
    const user: User = await this._http
      .get<User>(
        `${environment.apiUrl}${environment.apiPath}/user/${this.getToken()}`
      )
      .pipe(map((res) => new User(res)))
      .toPromise();
    return user;
  }

  private setSession(user: User) {
    if (!user.token || !user.expiresIn) {
      return;
    }
    const expiresAt = moment().add(user?.expiresIn, 'second');

    localStorage.setItem('id_token', user.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  public logout(): boolean {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    return this.isLoggedOut();
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public getToken() {
    return localStorage.getItem('id_token');
  }

  public getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public async signInWithFB(): Promise<SocialUser> {
    const fbLoginOptions = {
      scope: 'email',
    };
    return this.authService.signIn(
      FacebookLoginProvider.PROVIDER_ID,
      fbLoginOptions
    );
  }

  public async signOut(): Promise<any> {
    return this.authService.signOut();
  }
}
