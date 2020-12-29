import { CATEGORIES } from '../../Product/entities/product.enum';
import { Transporter } from '../../Configuration/entities/transporter.enum';

export interface IListOrderInterface {
  userId: string;
  userEmail: string;
  product: Array<{ productName: string; quantity: number; categories: CATEGORIES }>;
  reduction: { isReduction: boolean; type: string };
  shipment: Transporter;
}
