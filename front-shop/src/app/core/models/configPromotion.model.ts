export class ConfigPromotion {
  public id: number;
  public isPromotion?: boolean;
  public codePromotion?: string;
  public promotionReduction?: number;

  constructor(data?: any) {
    this.id = data?.id;
    this.isPromotion = data?.isPromotion;
    this.codePromotion = data?.codePromotion;
    this.promotionReduction = data?.promotionReduction;
  }
}
