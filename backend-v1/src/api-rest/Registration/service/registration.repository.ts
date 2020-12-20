import {Service} from "@tsed/common";
import {hashSync} from "bcrypt";
import {UserRepository} from "../../User/services/user.repository";
import {UserModel} from "../../User/models/user.model";
import {WinstonLogger} from "../../../core/winston-logger";

@Service()
export class RegistrationRepository {
    constructor(private _userService: UserRepository) {
    }

    async main(registerUser: UserModel){
    const registerUserToSaved: UserModel = new UserModel();
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
