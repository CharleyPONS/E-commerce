export interface IListOrderInterface {
  userId: string;
  userEmail: string;
  product: Array<{ productName: string; quantity: number }>;
  reduction: { isReduction: boolean; type: string };
}
