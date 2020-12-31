import { Transporter } from '../../Configuration/entities/transporter.enum';
import { CATEGORIES } from '../../Product/entities/product.enum';

export interface IListOrderInterface {
  userId: string;
  userEmail: string;
  product: Array<{
    productName: string;
    quantity: number;
    grammeNumber: number;
    categories?: CATEGORIES;
  }>;
  reduction: { isReduction: boolean; type: string };
  shipment: Transporter;
}
