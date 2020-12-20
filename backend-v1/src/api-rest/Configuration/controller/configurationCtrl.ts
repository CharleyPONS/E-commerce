import {Context, Controller, Get} from "@tsed/common";
import {Returns, Summary} from "@tsed/schema";
import {ConfigurationCRUDService} from "../service/configurationCRUD.service";
import {WinstonLogger} from "../../../core/winston-logger";


@Controller({
    path: "/configuration",
})
export class ConfigurationCtrl {
    constructor(private _configurationCRUDService: ConfigurationCRUDService) {}

    @Get("")
    @Summary("Return a User from his ID")
    @Returns(200).Description('get Config')
    async getConfiguration(@Context() ctx: Context): Promise<void> {
        new WinstonLogger().logger().info(`retreive configuration`);
        return await this._configurationCRUDService.find()
    }
}
