import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IListOrderInterface } from '../../order/form-process-order/form-process-order.component';

@Injectable({
  providedIn: 'root',
})
export class UserOrderedService {
  constructor(private _http: HttpClient) {}
  async intentPayment(
    listOrder: IListOrderInterface
  ): Promise<{
    clientSecret: string | null;
  }> {
    const secret: {
      clientSecret: string | null;
    } = await this._http
      .post<{
        clientSecret: string | null;
      }>(
        `${environment.apiUrl}${environment.apiPath}/user-payment/intent-payment`,
        listOrder
      )

      .toPromise();
    return secret;
  }
}
