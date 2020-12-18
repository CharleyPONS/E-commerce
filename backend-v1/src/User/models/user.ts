import {Model, ObjectID, PreHook} from "@tsed/mongoose";
import {IdDb} from "../../core/models/id-db.enum";
import {Description, Pattern, Property, Required} from "@tsed/schema";

@Model({
connection: IdDb.SHOP_DATABASE
})
@PreHook("save", (user: User, next) => {
    if (!user.numberOrder) {
        user.numberOrder = 0;
    }
    if (!user.amountOrder) {
        user.amountOrder = 0;
    }
    next();
})
export class User {
    @ObjectID('id')
    _id: string;

    @Required()
    @Property()
    name: string;

    @Required()
    @Property()
    surname: string;

    @Required()
    @Property()
    password: string;

    @Required()
    @Pattern('\t^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')
    @Property()
    email: string;

    @Property()
    numberOrder: number;

    @Property()
    @Description("Last modification date")
    createdAt: Date = new Date();

    @Property()
    @Description("JWT set for auth")
    token: string;

    @Property()
    @Description("Depending on the product in stock we add the right unity of measure")
    amountOrder: number

}
