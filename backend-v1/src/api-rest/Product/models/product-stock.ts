import {Schema} from "@tsed/mongoose";
import {IdDb} from "../../../core/models/enum/id-db.enum";
import {Enum, Property, Required} from "@tsed/schema";
import {UNITY} from "./product.enum";

@Schema({
    connection: IdDb.SHOP_DATABASE
})
export class ProductStock {
    @Required()
    @Property()
    quantity: number;

    @Required()
    @Property()
    @Enum(UNITY)
    unityMeasure: UNITY;
}
