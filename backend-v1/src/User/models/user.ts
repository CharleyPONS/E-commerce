import {Model, ObjectID, PreHook} from "@tsed/mongoose";
import {IdDb} from "../../core/models/enum/id-db.enum";
import {Allow, Description, Email, Property, Required} from "@tsed/schema";

// Use save in place of update to apply hook middleware
@Model({
connection: IdDb.SHOP_DATABASE
})
@PreHook("save", (user: User, next) => {
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
    @Email()
    @Property()
    email: string;

    @Property()
    numberOrder: Array<{isValidate: boolean, madeAt: string}>;

    @Property()
    @Description("Last modification date")
    updatedAt: string = new Date().toISOString();

    @Property()
    @Allow(null)
    @Description("JWT set for auth")
    token: string;

    @Property()
    @Description("Depending on the product in stock we add the right unity of measure")
    amountOrder: number

}
