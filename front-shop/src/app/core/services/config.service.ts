import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Config } from '../models/config.model';

@Injectable()
export class ConfigService {
  constructor(private _http: HttpClient) {}

  async getConfig(): Promise<Config> {
    return this._http
      .get<Config>(`${environment.apiUrl}${environment.apiPath}/configuration`)
      .pipe(map(
        (res) => new Config(res),
      )).toPromise();
  }
}
