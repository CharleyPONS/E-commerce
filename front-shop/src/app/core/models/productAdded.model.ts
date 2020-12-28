export class ProductAdded {
  public isAdded: boolean;
  public identifier: string;

  constructor(data: ProductAdded) {
    this.isAdded = data?.isAdded;
    this.identifier = data?.identifier;
  }
}
