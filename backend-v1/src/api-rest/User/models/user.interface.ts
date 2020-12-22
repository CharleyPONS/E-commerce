export interface IUser {
  id?: number;
  address?: UserAdress;
  name?: string;
  surname?: string;
  password?: string;
  email?: string;
  numberOrder?: number;
  dateUpdate?: string;
  token?: string | null;
  userOrder?: UserOrder;
}
