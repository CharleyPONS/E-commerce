import {Model, ObjectID} from "@tsed/mongoose";
import {IdDb} from "../../../core/models/enum/id-db.enum";
import {Enum, Property, Required} from "@tsed/schema";
import {AuthMethod} from "./authMethod.enum";
import {Transporter} from "./transporter.enum";

@Model({
    connection: IdDb.SHOP_DATABASE
})
export class Configuration {
    @ObjectID('id')
    _id?: string;

    @Required()
    @Property()
    @Enum(AuthMethod)
    auth: Array<AuthMethod>;

    @Required()
    @Property()
    @Enum(Transporter)
    transporter: Array<Transporter>;

    @Property()
    isPromotion?: {active: boolean, dueDate: string};

    @Property()
    sponsorship?: {active: boolean, dueDate: string};
}
