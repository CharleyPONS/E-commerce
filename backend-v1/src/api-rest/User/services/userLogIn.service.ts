import {Context, Service} from "@tsed/common";
import {UserModel} from "../models/user.model";
import {WinstonLogger} from "../../../core/winston-logger";
import {UserRepository} from "./user.repository";
import {NotFound} from "@tsed/exceptions";
import {compareSync} from "bcrypt";
import {sign} from "jsonwebtoken";

@Service()
export class UserLogInService {
    constructor(private _userRepository: UserRepository) {

    }
   async main(context: Context, userBody: UserModel ): Promise<UserModel>{
       const user: UserModel = await this._userRepository.findByEmail(userBody?.email);
       if(!user){
           new WinstonLogger().logger().info(`User not found to login`, {userBody});
           throw new NotFound("User not found to login ");
       }
       const passwordValid: boolean = compareSync(userBody?.password, user?.password);
       if(!passwordValid){
           new WinstonLogger().logger().info(`Password wrong`, {userBody});
           context.getResponse().status(500).send({
               ...user, token: ''
           })
       }
       const token: string = sign({id: user._id}, process.env.JWT_KEY as string, {expiresIn: process.env.JWT_EXPIRES_MS});
       await this._userRepository.updateOne({userId: user.userId},{token: token}, user);
       new WinstonLogger().logger().info(`Token create for user`, {user, token});
       return {...user, token: token};
    }
}
