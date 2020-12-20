import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {Product} from "../models/product";
import {WinstonLogger} from "../../../core/winston-logger";
import {User} from "../../User/models/user";
import {FilterQuery, UpdateQuery} from "mongoose";
import {CATEGORIES} from "../models/product.enum";

@Service()
export class ProductCRUDService {
    @Inject(Product)
    private product: MongooseModel<Product>;

    $onInit(){
    }

    async findById(id: string): Promise<any>{
        try{
            new WinstonLogger().logger().info(`Search a product with id ${id}`);
            return await this.product.findById(id).exec();
        }catch (err) {
            new WinstonLogger().logger().warn(`Search a product with id ${id} request failed`),
                {error: err};

        }
    }

    async findByCategories(categoriesSelected: CATEGORIES): Promise<any>{
        try{
            new WinstonLogger().logger().info(`Search a product with id ${categoriesSelected}`);
            return await this.product.findOne({categories: categoriesSelected}).exec();
        }catch (err) {
            new WinstonLogger().logger().warn(`Search a product with id ${categoriesSelected} request failed`),
                {error: err};

        }
    }

    async save(product: Product): Promise<any> {
        try {
            const model = new this.product(product);
            new WinstonLogger().logger().info(`Save product`, {product});
            await model.save();
            new WinstonLogger().logger().info(`Save product succeed`, {product});

            return model;
        }catch(err){
            new WinstonLogger().logger().warn(`Save a product with id request failed`),
                {error: err};

        }
    }

    async updateOne(filter: FilterQuery<User>, updateQuery: UpdateQuery<User>,product: Product): Promise<any> {
        try {
            new WinstonLogger().logger().info(`update product`, {product});
            await this.product.updateOne(filter, updateQuery);
            new WinstonLogger().logger().info(`Update product succeed`, {product});
        }catch(err){
            new WinstonLogger().logger().warn(`Update a product with id request failed`,
                {error: err});
        }
    }

    async findAll(): Promise<Product[]> {
        new WinstonLogger().logger().info(`Find all product`);
        const product: Product[] =  await this.product.find().exec();
        return product;
    }


}
