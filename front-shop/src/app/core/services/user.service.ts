import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}
  async connectUser(userBody: User): Promise<User> {
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

  async registerUser(userBody: User): Promise<boolean> {
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

  async saveUser(userBody: User): Promise<User> {
    const user: User = await this._http
      .post<User>(
        `${environment.apiUrl}${environment.apiPath}/user/save`,
        userBody
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

  private logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
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
}
