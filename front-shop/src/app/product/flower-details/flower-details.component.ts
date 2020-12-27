import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categories } from '../../core/enum/categories.enum';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-flower-details',
  templateUrl: './flower-details.component.html',
  styleUrls: ['./flower-details.component.scss'],
})
export class FlowerDetailsComponent implements OnInit {
  public product: Product;
  constructor(
    private _productService: ProductService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<any> {
    const products: Product[] = await this._productService.getAllProduct();
    (products || []).map((v) => v.categories === Categories.FLOWER);
    const productIdFromRoute = this.route.snapshot.paramMap.get('productId');
    products.filter((v) => v.name === productIdFromRoute);
    this.product = products[0];
  }
}
