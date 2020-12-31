import { IUserAddress } from './userAdress.interface';

export interface IUser {
  id?: number;
  address: IUserAddress;
  name: string;
  surname: string;
  password?: string;
  email?: string;
  numberOrder?: number;
  dateUpdate?: string;
  token?: string | null;
}
