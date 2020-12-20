import {Model, ObjectID, PreHook} from "@tsed/mongoose";
import {IdDb} from "../../../core/models/enum/id-db.enum";
import {Description, Enum, Maximum, Minimum, Property, Required} from "@tsed/schema";
import {CATEGORIES} from "./product.enum";
import {Next} from "@tsed/common";
import {ProductStock} from "./product-stock";

@Model({
connection: IdDb.SHOP_DATABASE
})
@PreHook("save" ,(product: Product, next: Next) => {
    if(!product.dateUpdate){
        product.dateUpdate = new Date().toISOString();
    }
    next();
})
export class Product {
    @ObjectID('id')
    _id?: string;

    @Required()
    @Property()
    name: string;

    @Required()
    @Property()
    @Enum(CATEGORIES)
    categories: CATEGORIES;

    @Required()
    @Minimum(5)
    @Maximum(100)
    @Property()
    price: number;

    @Minimum(0)
    @Maximum(80)
    @Property()
    cbdRate?: number;

    @Minimum(0)
    @Maximum(1)
    @Property()
    thcRate?: number;

    @Property()
    @Description("Last modification date")
    dateUpdate?: string;

    @Property()
    @Description("Depending on the product in stock we add the right unity of measure")
    stock?: ProductStock

}
