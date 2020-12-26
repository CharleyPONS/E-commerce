export class ProductPrice {
  public id: number;
  public basePrice: number;
  public priceForThreeGramme: number;
  public priceForFiveGramme: number;
  public priceForTenGramme: number;
  constructor(data: ProductPrice) {
    this.id = data?.id;
    this.basePrice = data?.basePrice;
    this.priceForFiveGramme = data?.priceForFiveGramme;
    this.priceForTenGramme = data?.priceForTenGramme;
    this.priceForThreeGramme = data?.priceForThreeGramme;
  }
}
