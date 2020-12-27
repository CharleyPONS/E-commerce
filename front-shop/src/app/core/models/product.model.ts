import { cloneDeep } from 'lodash';
import { Categories } from '../enum/categories.enum';
import { ProductPrice } from './productPrice.model';
import { ProductStock } from './productStock.model';

export class Product {
  public id: number;
  public name: string;
  public categories: Categories;
  public price: ProductPrice;
  public cbdRate?: number;
  public thcRate?: number;
  public dateUpdate: string;
  public stock?: ProductStock;
  public imagePath?: string;
  public mainDescription?: string;
  public optionalDescription?: string;
  public title?: string;

  constructor(data: Product) {
    this.id = data?.id;
    this.name = data?.name;
    this.categories = data?.categories;
    this.price = new ProductPrice(data?.price as ProductPrice);
    this.cbdRate = data?.cbdRate;
    this.thcRate = data?.thcRate;
    this.dateUpdate = data?.dateUpdate;
    this.stock = new ProductStock(data?.stock as ProductStock);
    this.imagePath = `../assets/product/${data?.imagePath}`;
    this.mainDescription = data?.mainDescription;
    this.optionalDescription = data?.optionalDescription;
    this.title = data?.title;
  }

  public clone() {
    return cloneDeep(this);
  }
}
