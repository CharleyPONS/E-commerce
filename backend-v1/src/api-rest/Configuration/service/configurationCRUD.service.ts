import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {WinstonLogger} from "../../../core/winston-logger";
import {Configuration} from "../models/configuration";

@Service()
export class ConfigurationCRUDService {
    @Inject(Configuration)
    private configuration: MongooseModel<Configuration>;

    async find(): Promise<any>{
        try{
            const configuration =  await this.configuration.find().exec();
            return configuration;
        }catch (err) {
            new WinstonLogger().logger().warn(`Error retrieve configuration`,
                {error: err})

        }
    }
}
