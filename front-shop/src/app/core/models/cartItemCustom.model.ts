import { CartItem } from 'ng-shopping-cart';

export class CartItemCustom extends CartItem {
  public identifier: string;
  public label: string;
  public cost: number;
  public amount: number;
  public description: string;
  public country: string;
  public photo: string;
  public quantity: number;
  public grammeNumber: number | boolean;

  constructor(itemData: any = {}) {
    super();
    const {
      identifier,
      label,
      cost,
      amount,
      description,
      country,
      photo,
      quantity,
      grammeNumber,
    } = itemData;
    this.identifier = identifier || 0;
    this.label = label || '';
    this.cost = cost || 0;
    this.amount = amount || 1;
    this.description = description || '';
    this.country = country || '';
    this.photo = photo || '';
    this.quantity = quantity || 1;
    this.grammeNumber = grammeNumber || 0;
  }

  getId(): any {
    return this.identifier;
  }

  getName(): string {
    return this.label;
  }

  getPrice(): number {
    return this.cost;
  }

  getQuantity(): number {
    return this.amount;
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  getImage(): string {
    return this.photo;
  }

  getAmount() {
    return this.amount;
  }
  setAmount(quantity: number): void {
    this.amount = this.cost * quantity;
  }
}
