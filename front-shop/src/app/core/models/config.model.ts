import { AuthMethod } from '../enum/authMethod.enum';
import { Transporter } from '../enum/transporter.enum';

export class Config {
  public id: number;
  public auth: AuthMethod[];
  public configurationType: string;
  public transporter: Transporter[];
  public isPromotion?: boolean;
  public promotionReduction?: number;
  public sponsorship?: boolean;
  public dueDatePromotion?: string;
  public dueDateSponsorship?: string;

  constructor(data?: any) {
    this.id = data?.id;
    this.auth = data?.auth;
    this.configurationType = data?.configurationType;
    this.transporter = data?.transporter;
    this.isPromotion = data?.isPromotion;
    this.promotionReduction = data?.promotionReduction;
    this.sponsorship = data?.sponsorship;
    this.dueDatePromotion = data?.dueDatePromotion;
    this.dueDateSponsorship = data?.dueDateSponsorship;
  }
}
