import { Service } from '@tsed/common';
import { hashSync } from 'bcrypt';

import { MailProcess } from '../../../core/models/enum/mailProcess.enum';
import { EmailSenderService } from '../../../core/services/emailSender.service';
import { WinstonLogger } from '../../../core/services/winstonLogger';
import { UserEntity } from '../../User/entities/user.entity';
import { UserRepository } from '../../User/services/user.repository';
import { IUser } from '../../User/models/user.interface';

@Service()
export class RegistrationService {
  constructor(
    private _userService: UserRepository,
    private _emailSenderService: EmailSenderService
  ) {}

  async main(registerUser: IUser) {
    const registerUserToSaved: UserEntity = new UserEntity();
    registerUserToSaved.email = registerUser.email as string;
    registerUserToSaved.password = hashSync(registerUser.password, 10);
    await this._userService.saveUser(registerUserToSaved);
    const user = this._userService.findByEmail(registerUserToSaved.email);
    if (!user) {
      new WinstonLogger().logger().info(`user not found`, { user });
      throw new Error('user not found error during the save process');
    }
    await this._emailSenderService.main(registerUserToSaved, MailProcess.NEW_CLIENT);
    return user;
  }
}
