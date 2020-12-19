import {Context, Service} from "@tsed/common";
import {WinstonLogger} from "../../../core/winston-logger";
import {NotFound} from "@tsed/exceptions";
import {UserOrdered} from "../models/userOrdered";
import {UserCRUDService} from "../../User/services/userCRUD.service";
import {User} from "../../User/models/user";
import {UserCommandCRUDService} from "./userCommandCRUD.service";
import {isEqual, merge} from 'lodash';

@Service()
export class UserCommandService {
    constructor(private _userCRUDService: UserCRUDService,
                private _userOrderedCRUDService: UserCommandCRUDService) {

    }
    async main(context: Context, userCommand: UserOrdered ): Promise<void>{
        const user: User = await this._userCRUDService.findByUserId(userCommand?.userId);
        if(!user){
            new WinstonLogger().logger().info(`User not found to login`, {userCommand});
            throw new NotFound("User not found to login ");
        }
        await this._userCRUDService.updateOne({userId: userCommand?.userId},
            {numberOrder: (user?.numberOrder || []).concat(
                {isValidate: false, madeAt: new Date().toISOString()})},
                 user);
        const command: UserOrdered = await this._userOrderedCRUDService.findById(userCommand._id);
        if(command){
            if(isEqual(command, userCommand)){
                new WinstonLogger().logger().info(`Command already store no need to update`, {userCommand});
                return;
            }
            await this._userOrderedCRUDService.updateOne({userOrderedId: userCommand.userOrderedId}, merge(command, userCommand), merge(command, userCommand))
            context.getResponse().status(204).send('order update')
        }else{
            await this._userOrderedCRUDService.save(userCommand);
            context.getResponse().status(204).send('order create')
        }


    }
}
