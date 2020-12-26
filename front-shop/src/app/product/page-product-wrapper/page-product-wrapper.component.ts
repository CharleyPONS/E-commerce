import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-page-product-wrapper',
  templateUrl: './page-product-wrapper.component.html',
  styleUrls: ['./page-product-wrapper.component.scss'],
})
export class PageProductWrapperComponent implements OnInit {
  @Input() product: Product;
  @Input() textProductTitle: string;

  constructor() {}

  ngOnInit(): void {}
}
