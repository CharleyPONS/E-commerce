import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {Product} from "../models/product";
import {WinstonLogger} from "../../core/winston-logger";

@Service()
export class ProductService {
    @Inject(Product)
    private product: MongooseModel<Product>;

    $onInit(){
    }

    async findById(id: string): Promise<any>{
        try{
            new WinstonLogger().logger().info(`Search a product with id ${id}`);
            const calendar =  await this.product.findById(id).exec();
            return calendar;
        }catch (e) {
            new WinstonLogger().logger().warn(`Search a product with id ${id} request failed`),
                {error: e};

        }
    }

    async save(product: Product): Promise<any> {
        try {

            const model = new this.product(product);
            new WinstonLogger().logger().info(`Save product`, {product});
            await model.updateOne(product, {upsert: true});
            new WinstonLogger().logger().info(`Save product succeed`, {product});

            return model;
        }catch(e){
            new WinstonLogger().logger().warn(`Save a product with id request failed`),
                {error: e};

        }
    }

    async findAll(options = {}): Promise<Product[]> {
        new WinstonLogger().logger().info(`Find all product`);
        return this.product.find(options).exec();
    }


}
