import {Context, Service} from "@tsed/common";
import {WinstonLogger} from "../../../core/winston-logger";
import {NotFound} from "@tsed/exceptions";
import {UserOrderedModel} from "../models/userOrdered.model";
import {UserRepository} from "../../User/services/user.repository";
import {UserModel} from "../../User/models/user.model";
import {UserCommandRepository} from "./userCommand.repository";
import {isEqual, merge} from 'lodash';

@Service()
export class UserCommandService {
    constructor(private __userRepository: UserRepository,
                private _userCommandRepository: UserCommandRepository) {

    }
    async main(context: Context, userCommand: UserOrderedModel ): Promise<void>{
        const user: UserModel = await this.__userRepository.findByUserId(userCommand?.userId);
        if(!user){
            new WinstonLogger().logger().info(`User not found to login`, {userCommand});
            throw new NotFound("User not found to login ");
        }
        await this.__userRepository.updateOne({userId: userCommand?.userId},
            {numberOrder: (user?.numberOrder || []).concat(
                {isValidate: false, madeAt: new Date().toISOString()})},
                 user);
        const command: UserOrderedModel = await this._userCommandRepository.findById(userCommand._id);
        if(command){
            if(isEqual(command, userCommand)){
                new WinstonLogger().logger().info(`Command already store no need to update`, {userCommand});
                return;
            }
            await this._userCommandRepository.updateOne({userOrderedId: userCommand.userOrderedId}, merge(command, userCommand), merge(command, userCommand))
            context.getResponse().status(204).send('order update')
        }else{
            await this._userCommandRepository.save(userCommand);
            context.getResponse().status(204).send('order create')
        }


    }
}
