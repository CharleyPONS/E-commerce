import { Unity } from '../enum/unity.enum';

export class ProductStock {
  public id: number;
  public quantity: number;
  public unityMeasure: Unity;
  public product: string;

  constructor(data: ProductStock) {
    this.id = data?.id;
    this.quantity = data?.quantity;
    this.unityMeasure = data?.unityMeasure;
    this.product = data?.product;
  }
}
