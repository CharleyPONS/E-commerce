export class UserAddress {
  public id?: number;
  public town: string;
  public street: string;
  public numberStreet?: number;
  public postalCode: number;
  public country: string;

  constructor(data: UserAddress) {
    this.id = data?.id;
    this.town = data?.town;
    this.street = data?.street;
    this.numberStreet = data?.numberStreet;
    this.postalCode = data?.postalCode;
    this.country = data?.country;
  }
}
