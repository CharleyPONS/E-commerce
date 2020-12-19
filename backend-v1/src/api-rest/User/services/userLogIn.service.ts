import {Context, Service} from "@tsed/common";
import {User} from "../models/user";
import {WinstonLogger} from "../../../core/winston-logger";
import {UserCRUDService} from "./userCRUD.service";
import {NotFound} from "@tsed/exceptions";
import {compareSync} from "bcrypt";
import {sign} from "jsonwebtoken";

@Service()
export class UserLogInService {
    constructor(private _userCRUDService: UserCRUDService) {

    }
   async main(context: Context, userBody: User ): Promise<User>{
       const user: User = await this._userCRUDService.findByEmail(userBody?.email);
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
       await this._userCRUDService.save({...user, token: token});
       new WinstonLogger().logger().info(`Token create for user`, {user, token});
       return {...user, token: token};
    }
}
