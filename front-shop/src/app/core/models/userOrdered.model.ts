import { UserOrderedProducts } from './userOrderedProduct.model';

export class UserOrdered {
  public id: number;
  public userOrderedId: string;
  public billId?: string;
  public paid?: boolean;
  public amount: number;
  public dateUpdate: string;
  public product: UserOrderedProducts[];
  public userId: string;

  constructor(data: UserOrdered) {
    this.id = data?.id;
    this.userOrderedId = data?.userOrderedId;
    this.billId = data?.billId;
    this.paid = data?.paid;
    this.amount = data?.amount;
    this.dateUpdate = data?.dateUpdate;
    const product: UserOrderedProducts[] = [];
    (data?.product || []).forEach((v) => {
      product.push(new UserOrderedProducts(v));
    });
    this.product = product;
    this.product = data?.product;
    this.userId = data?.userId;
  }
}
