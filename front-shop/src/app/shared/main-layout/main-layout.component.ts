import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'ng-shopping-cart';
import { CartItemCustom } from '../../core/models/cartItemCustom.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  constructor(private cartService: CartService<CartItemCustom>) {}

  ngOnInit(): void {}
}
