import { Transporter } from '../enum/transporter.enum';

export class ConfigTransporter {
  public id: number;
  public type?: Transporter;
  public basePrice?: number;
  public delay?: string;

  constructor(data?: any) {
    this.id = data?.id;
    this.type = data?.type;
    this.basePrice = data?.basePrice;
    this.delay = data?.delay;
  }
}
