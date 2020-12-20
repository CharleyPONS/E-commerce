import {Model, ObjectID, PreHook} from "@tsed/mongoose";
import {IdDb} from "../../../core/models/enum/id-db.enum";
import {Description, Email, Minimum, Property, Required} from "@tsed/schema";
import {Next} from "@tsed/common";
import {UserOrderedProductsSchema} from "./userOrderedProducts.schema";

// Use save in place of update to apply hook middleware
@Model({
    connection: IdDb.SHOP_DATABASE,
    collection: 'user-products'
})
@PreHook("save", (userOrdered: UserOrderedModel, next: Next) => {
    if(!userOrdered.updatedAt){
        userOrdered.updatedAt = new Date().toISOString();
    }
    if(!userOrdered.paid){
        userOrdered.paid = false;
    }
    next();
})
export class UserOrderedModel {
    @Required()
    @ObjectID('id')
    _id: string;

    @Required()
    @ObjectID('id')
    userId: string;

    @Required()
    @ObjectID('id')
    @Property()
    userOrderedId: string;

    @ObjectID('id')
    @Property()
    billId?: string;

    @Required()
    @Property()
    paid?: boolean;

    @Required()
    @Property()
    @Minimum(10)
    amount: number;

    @Required()
    @Property()
    products: Array<UserOrderedProductsSchema>;

    @Property()
    @Description("Last modification date")
    updatedAt: string;
}
