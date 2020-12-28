import { Component, OnInit } from '@angular/core';
import { Categories } from '../../core/enum/categories.enum';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-hash',
  templateUrl: './hash.component.html',
  styleUrls: ['./hash.component.scss'],
})
export class HashComponent implements OnInit {
  public products: Product[];
  constructor(private _productService: ProductService) {}

  async ngOnInit(): Promise<any> {
    this.products = await this._productService.getAllProduct();
    console.log(this.products);
    this.products = (this.products || []).filter(
      (v) => v.categories === Categories.RESINE
    );
  }

  public productOrder(product: Product[]) {
    this.products = product;
  }
}
