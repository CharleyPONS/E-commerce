import {Service} from "@tsed/common";
import {hashSync} from "bcrypt";
import {UserCRUDService} from "../../User/services/userCRUD.service";
import {User} from "../../User/models/user";
import {WinstonLogger} from "../../../core/winston-logger";

@Service()
export class RegistrationService {
    constructor(private _userService: UserCRUDService) {
    }

    async main(registerUser: User){
    const registerUserToSaved: User = new User();
    registerUserToSaved.name = registerUser.name;
    registerUserToSaved.email = registerUser.email;
    registerUserToSaved.password = hashSync(registerUser.password, 10);
    await this._userService.save(registerUserToSaved);
    const user = this._userService.findByEmail(registerUserToSaved.email);
    if(!user){
        new WinstonLogger().logger().info(`user not found`, {user});
        throw new Error('user not found error during the save process')
    }
    return user;
    }

}
