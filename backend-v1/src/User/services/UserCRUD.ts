import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {User} from "../models/user";
import {WinstonLogger} from "../../core/winston-logger";

@Service()
export class UserCRUD {
    @Inject(User)
    private user: MongooseModel<User>;

    $onInit(){
    }

    async findById(id: string): Promise<any>{
        try{
            new WinstonLogger().logger().info(`Search a product with id ${id}`);
            const user =  await this.user.findById(id).exec();
            return user;
        }catch (e) {
            new WinstonLogger().logger().warn(`Search a user with id ${id} request failed`,
                {error: e})

        }
    }

    async findByEmail(email: string): Promise<any>{
        try{
            new WinstonLogger().logger().info(`Search a product with id ${email}`);
            const user =  await this.user.findOne({email: email}).exec();
            return user;
        }catch (e) {
            new WinstonLogger().logger().warn(`Search a user with id ${email} request failed`,
                {error: e})

        }
    }

    async save(user: User): Promise<any> {
        try {

            const model = new this.user(user);
            new WinstonLogger().logger().info(`Save user`, {user});
            await model.save();
            new WinstonLogger().logger().info(`Save user succeed`, {user});

            return model;
        }catch(e){
            new WinstonLogger().logger().warn(`Save a user with id request failed`,
                {error: e});

        }
    }

    async createUser(user: User): Promise<any> {
        try {

            const model = new this.user(user);
            new WinstonLogger().logger().info(`create user`, {user});
            await this.user.create(model);
            new WinstonLogger().logger().info(`Create user succeed`, {user});
            return model;
        }catch(e){
            new WinstonLogger().logger().warn(`Save a user with id request failed`,
                {error: e});

        }
    }

    async delete(id: string): Promise<any> {
        try {
            new WinstonLogger().logger().info(`Save user`, {id});
            await this.user.deleteOne({__id: id});
            new WinstonLogger().logger().info(`Save user succeed`, {id});
            return;
        }catch(e){
            new WinstonLogger().logger().warn(`Save a user with id request failed`,
                {error: e});

        }
    }

}
