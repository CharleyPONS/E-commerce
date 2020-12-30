import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isString } from 'lodash';

import { environment } from '../../../environments/environment';
import { Config } from '../models/config.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private _http: HttpClient) {}

  async getConfig(): Promise<Config> {
    const config: Config = await this._http
      .get<Config>(`${environment.apiUrl}${environment.apiPath}/configuration`)
      .toPromise();
    return new Config(config[0]);
  }

  async sendPromotionCode(promotionCode: string): Promise<any> {
    if (!promotionCode && !isString(promotionCode)) {
      return false;
    }
    const codeValid = await this._http
      .post<any>(
        `${environment.apiUrl}${environment.apiPath}/configuration/reduction`,
        { code: promotionCode }
      )
      .toPromise();
    return codeValid;
  }
}
