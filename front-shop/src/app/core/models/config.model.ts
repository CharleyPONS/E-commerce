import { AuthMethod } from '../enum/authMethod.enum';
import { ConfigPromotion } from './configPromotion.model';
import { ConfigTransporter } from './configTransporter.model';

export class Config {
  public id: number;
  public auth: AuthMethod[];
  public configurationType: string;
  public transporter: ConfigTransporter[];
  public minPriceFreeShipment: number;
  public baseShipmentPrice: number;
  public promotion?: ConfigPromotion[];
  public sponsorship?: boolean;
  public dueDateSponsorship?: string;

  constructor(data?: Config) {
    this.id = data?.id;
    this.auth = data?.auth;
    this.configurationType = data?.configurationType;
    this.sponsorship = data?.sponsorship;
    this.minPriceFreeShipment = data?.minPriceFreeShipment;
    this.dueDateSponsorship = data?.dueDateSponsorship;
    const transporter: ConfigTransporter[] = [];
    (data?.transporter || []).forEach((v) => {
      transporter.push(new ConfigTransporter(v));
    });
    this.transporter = transporter;
    const promotion: ConfigTransporter[] = [];
    (data?.promotion || []).forEach((v) => {
      promotion.push(new ConfigPromotion(v));
    });
    this.promotion = promotion;
  }
}
