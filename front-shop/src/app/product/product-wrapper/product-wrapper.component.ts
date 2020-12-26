import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-wrapper',
  templateUrl: './product-wrapper.component.html',
  styleUrls: ['./product-wrapper.component.scss'],
})
export class ProductWrapperComponent implements OnInit {
  @Input() product: Product;
  constructor() {}

  ngOnInit(): void {}
}
