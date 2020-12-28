//TODO  JARTER L'ICONE AVEC UN DISPLAY NONE FOUTRE UNE ICONE
// MAISON ET UN ROUTER AU CLICK SUR LE APNIER FOUTRE UNE CHIPS AVEC LE NOMBRE DE TRUC COMMANDER
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent implements OnInit {
  public icon: string;
  public itemsText: string;
  public noItemsText: string;
  public manyItemsText: string;

  constructor() {}

  ngOnInit(): void {
    this.icon = '../../../assets/shopping_bag.svg';
    this.itemsText = '1 produit';
    this.noItemsText = '';
    this.manyItemsText = '# produits';
  }
}
