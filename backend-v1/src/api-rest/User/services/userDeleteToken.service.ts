import {Context, Service} from "@tsed/common";
import {User} from "../models/user";
import {WinstonLogger} from "../../../core/winston-logger";
import {UserCRUDService} from "./userCRUD.service";
import {NotFound} from "@tsed/exceptions";
import {compareSync} from "bcrypt";
import {sign} from "jsonwebtoken";

@Service()
export class UserDeleteTokenService {
    constructor(private _userCRUDService: UserCRUDService) {

    }
    async main(user: User): Promise<void> {
        try {
            new WinstonLogger().logger().info(`try to delete token`, {user: user.userId});
            await this._userCRUDService.updateOne({_id: user.userId}, {$unset: {token: 1}}, user)

        } catch (err) {
            new WinstonLogger().logger().warn(`Delete a token user with id ${user.userId} failed`,
                {error: err});
        }
    }
    }
