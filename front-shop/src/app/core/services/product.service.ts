import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Categories } from '../enum/categories.enum';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http: HttpClient) { }

  async getProductByCategory(category: Categories): Promise<Product> {
    return this._http
      .get<Product>(`${environment.apiUrl}${environment.apiPath}/product/${category}`)
      .pipe(map(
        (res) => new Product(res),
      )).toPromise();
  }

  async getAllProduct():Promise<Product[]> {
    const product = await this._http
      .get<Product>(`${environment.apiUrl}${environment.apiPath}/product`)
      .toPromise();

      return Array.isArray(product) ? (product || []).map(v => new Product(v)) : [];


  }
}
