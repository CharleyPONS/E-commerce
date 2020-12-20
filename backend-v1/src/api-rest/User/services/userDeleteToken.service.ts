import {Context, Service} from "@tsed/common";
import {UserModel} from "../models/user.model";
import {WinstonLogger} from "../../../core/winston-logger";
import {UserRepository} from "./user.repository";
import {NotFound} from "@tsed/exceptions";
import {compareSync} from "bcrypt";
import {sign} from "jsonwebtoken";

@Service()
export class UserDeleteTokenService {
    constructor(private _userRepository: UserRepository) {

    }
    async main(user: UserModel): Promise<void> {
        try {
            new WinstonLogger().logger().info(`try to delete token`, {user: user.userId});
            await this._userRepository.updateOne({_id: user.userId}, {$unset: {token: 1}}, user)

        } catch (err) {
            new WinstonLogger().logger().warn(`Delete a token user with id ${user.userId} failed`,
                {error: err});
        }
    }
    }
