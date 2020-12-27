import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Categories } from '../../core/enum/categories.enum';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-details-wrapper',
  templateUrl: './product-details-wrapper.component.html',
  styleUrls: ['./product-details-wrapper.component.scss'],
})
export class ProductDetailsWrapperComponent implements OnInit {
  @Input() product: Product;
  public form: FormGroup;
  public Categories: typeof Categories = Categories;
  constructor() {}

  ngOnInit(): void {}
}
