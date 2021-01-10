import { Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { hashSync } from 'bcrypt';

import { MailProcess } from '../../../core/models/enum/mailProcess.enum';
import { $logger } from '../../../core/services/customLogger';
import { EmailSenderService } from '../../../core/services/emailSender.service';
import { UserEntity } from '../../User/entities/user.entity';
import { IUser } from '../../User/models/user.interface';
import { UserRepository } from '../../User/services/user.repository';

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
      $logger.info(`user not found`, { user });
      throw new NotFound('user not found error during the save process');
    }
    await this._emailSenderService.main(registerUserToSaved, MailProcess.NEW_CLIENT);
    return user;
  }
}
