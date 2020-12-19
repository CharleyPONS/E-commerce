import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {User} from "../models/user";
import {WinstonLogger} from "../../../core/winston-logger";
import {ObjectId} from "bson";
import {FilterQuery, UpdateQuery} from "mongoose";

@Service()
export class UserCRUDService {
    @Inject(User)
    private user: MongooseModel<User>;

    $onInit(){
    }

    async findById(id: string): Promise<any>{
        try{
            new WinstonLogger().logger().info(`Search a product with id ${id}`);
            const user =  await this.user.findById(new ObjectId(id)).exec();
            return user;
        }catch (err) {
            new WinstonLogger().logger().warn(`Search a user with id ${id} request failed`,
                {error: err})

        }
    }

    async findByEmail(email: string): Promise<any>{
        try{
            new WinstonLogger().logger().info(`Search a product with id ${email}`);
            const user =  await this.user.findOne({email: email}).exec();
            return user;
        }catch (err) {
            new WinstonLogger().logger().warn(`Search a user with id ${email} request failed`,
                {error: err})

        }
    }

    async findByUserId(userId: string): Promise<any>{
        try{
            new WinstonLogger().logger().info(`Search a product with id ${userId}`);
            const user =  await this.user.findOne({userId: userId}).exec();
            return user;
        }catch (err) {
            new WinstonLogger().logger().warn(`Search a user with id ${userId} request failed`,
                {error: err})

        }
    }

    async save(user: User): Promise<any> {
        try {
            const model = new this.user(user);
            new WinstonLogger().logger().info(`Save user`, {user});
            await model.save();
            new WinstonLogger().logger().info(`Save user succeed`, {user});

            return model;
        }catch(err){
            new WinstonLogger().logger().warn(`Save a user with id request failed`,
                {error: err});

        }
    }

    async updateOne(filter: FilterQuery<User>, updateQuery: UpdateQuery<User>, user: User): Promise<any> {
        try {
            new WinstonLogger().logger().info(`update user`, {user});
            await this.user.updateOne(filter, updateQuery);
            new WinstonLogger().logger().info(`Update user succeed`, {user});
        }catch(err){
            new WinstonLogger().logger().warn(`Update a user with id request failed`,
                {error: err});

        }
    }

    async delete(userId: string): Promise<any> {
        try {
            new WinstonLogger().logger().info(`try todelete user`, {userId});
            await this.user.deleteOne({__id: userId});
            new WinstonLogger().logger().info(`Delete user succeed`, {userId});
            return;
        }catch(err){
            new WinstonLogger().logger().warn(`Delete a user with id ${userId} failed`,
                {error: err});

        }
    }
}
