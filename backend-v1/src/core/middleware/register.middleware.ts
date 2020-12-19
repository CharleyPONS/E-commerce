import {Context, IMiddleware, Middleware} from "@tsed/common";
import {UserCRUDService} from "../../api-rest/User/services/userCRUD.service";
import {WinstonLogger} from "../winston-logger";

@Middleware()
export class RegisterMiddleware implements IMiddleware {
    constructor(private _userService: UserCRUDService)
    {}
    async use(@Context() ctx: Context): Promise<void> {
       const result = await this._userService.findByEmail(ctx.request.body.email);
       if(result){
           new WinstonLogger().logger().warn('email already use', {email: ctx.request.body.email});
           return ctx.getResponse().status(500).send({message: 'email already use'})
       }
       return;

        }
}
