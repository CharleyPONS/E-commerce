import { Service } from '@tsed/common';
import { hashSync } from 'bcrypt';

import { MailProcess } from '../../../core/models/enum/mail-process.enum';
import { EmailSenderService } from '../../../core/services/email-sender.service';
import { WinstonLogger } from '../../../core/services/winston-logger';
import { UserEntity } from '../../User/entity/user.entity';
import { UserRepository } from '../../User/services/user.repository';

@Service()
export class RegistrationService {
  constructor(
    private _userService: UserRepository,
    private _emailSenderService: EmailSenderService
  ) {}

  async main(registerUser: UserEntity) {
    const registerUserToSaved: UserEntity = new UserEntity();
    registerUserToSaved.name = registerUser.name;
    registerUserToSaved.email = registerUser.email;
    registerUserToSaved.password = hashSync(registerUser.password, 10);
    await this._userService.save(registerUserToSaved);
    const user = this._userService.findByEmail(registerUserToSaved.email);
    if (!user) {
      new WinstonLogger().logger().info(`user not found`, { user });
      throw new Error('user not found error during the save process');
    }
    await this._emailSenderService.main(registerUserToSaved, MailProcess.NEW_CLIENT);
    return user;
  }
}
