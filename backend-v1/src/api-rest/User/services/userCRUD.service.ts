import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {User} from "../models/user";
import {WinstonLogger} from "../../../core/winston-logger";

@Service()
export class UserCRUDService {
    @Inject(User)
    private user: MongooseModel<User>;

    $onInit(){
    }

    async findById(id: string): Promise<any>{
        try{
            new WinstonLogger().logger().info(`Search a product with id ${id}`);
            const user =  await this.user.findById(id).exec();
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

    async createUser(user: User): Promise<any> {
        try {

            const model = new this.user(user);
            new WinstonLogger().logger().info(`create user`, {user});
            await this.user.create(model);
            new WinstonLogger().logger().info(`Create user succeed`, {user});
            return model;
        }catch(err){
            new WinstonLogger().logger().warn(`Save a user with id request failed`,
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

    async deleteToken(userId: string): Promise<any> {
        try{
            new WinstonLogger().logger().info(`try to delete token`, {userId});
            await this.user.updateOne({_id: userId}, {$unset: {token: 1}}  )

        }catch(err){
            new WinstonLogger().logger().warn(`Delete a token user with id ${userId} failed`,
                {error: err});
        }
    }

}
