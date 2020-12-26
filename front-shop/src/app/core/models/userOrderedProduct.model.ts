import { Categories } from '../enum/categories.enum';
import { Unity } from '../enum/unity.enum';

export class UserOrderedProducts {
  public id: number;
  public type: Categories;
  public productName: string;
  public quantity: number;
  public unityMeasure: Unity;

  constructor(data: UserOrderedProducts) {
    this.id = data?.id;
    this.type = data?.type;
    this.productName = data?.productName;
    this.quantity = data?.quantity;
    this.unityMeasure = data?.unityMeasure;
  }
}
