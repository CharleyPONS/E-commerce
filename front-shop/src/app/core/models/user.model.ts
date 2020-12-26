import { UserAddress } from './userAddress.model';

export class User {
  public id?: number;
  public userId?: string;
  public address?: UserAddress;
  public name?: string;
  public surname?: string;
  public password?: string;
  public email?: string;
  public numberOrder?: number;
  public dateUpdate?: string;
  public token?: string | null;
  public expiresIn?: number;
  constructor(data?: User) {
    this.id = data?.id;
    this.userId = data?.userId;
    this.address = data?.address
      ? new UserAddress(data?.address as UserAddress)
      : undefined;
    this.name = data?.name;
    this.surname = data?.surname;
    this.password = data?.password;
    this.email = data?.email;
    this.numberOrder = data?.numberOrder;
    this.dateUpdate = data?.dateUpdate;
    this.token = data?.token;
    this.expiresIn = data?.expiresIn;
  }
}
