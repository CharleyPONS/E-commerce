import {Model, ObjectID, PreHook, SchemaIgnore} from "@tsed/mongoose";
import {IdDb} from "../../../core/models/enum/id-db.enum";
import {Allow, Description, Email, Property, Required} from "@tsed/schema";
import {Next} from "@tsed/common";

// Use save in place of update to apply hook middleware
@Model({
connection: IdDb.SHOP_DATABASE,
    name: 'Users'
})
@PreHook("save", (user: User, next: Next) => {
    if (!user.amountOrder) {
        user.amountOrder = 0;
    }
    if(!user.updatedAt){
        user.updatedAt = new Date().toISOString();
    }
    next();
})
export class User {
    @SchemaIgnore()
    @ObjectID('id')
    _id: string;

    @ObjectID('id')
    userId: string;

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
    updatedAt: string;

    @Property()
    @Allow(null)
    @Description("JWT set for auth")
    token: string;

    @Property()
    @Description("Depending on the product in stock we add the right unity of measure")
    amountOrder: number

}
