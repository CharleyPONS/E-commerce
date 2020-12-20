import {Schema} from "@tsed/mongoose";
import {IdDb} from "../../../core/models/enum/id-db.enum";
import {Enum, Minimum, Property, Required} from "@tsed/schema";
import {CATEGORIES, UNITY} from "../../Product/models/product.enum";

@Schema({
    connection: IdDb.SHOP_DATABASE
})
export class UserOrderedProducts {
    @Required()
    @Property()
    @Enum(CATEGORIES)
    type: CATEGORIES;

    @Required()
    @Property()
    @Minimum(2)
    amount: number;

    @Required()
    @Property()
    @Enum(UNITY)
    unityMeasure: UNITY;
}
