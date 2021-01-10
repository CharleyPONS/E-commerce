import { Context, Service } from '@tsed/common';
import { NotFound, Unauthorized } from '@tsed/exceptions';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { config } from '../../../core/config';
import { $logger } from '../../../core/services/customLogger';
import { IUser } from '../models/user.interface';

import { UserRepository } from './user.repository';

@Service()
export class UserLogInService {
  constructor(private _userRepository: UserRepository) {}
  async main(context: Context, userBody: IUser): Promise<any> {
    let user;
    if (userBody.email) {
      user = await this._userRepository.findByEmail(userBody.email);
    }
    if (!user) {
      $logger.info(`User not found to login`, { userBody });
      throw new NotFound('User not found to login ');
    }
    const passwordValid: boolean = compareSync(userBody?.password, user.password);
    if (!passwordValid) {
      $logger.warn(`Password wrong`, { userBody });
      throw new Unauthorized('User password validation have failed');
    }
    const getToken: string = sign({ id: user.id }, config.JWT_KEY as string, {
      expiresIn: config.JWT_EXPIRES_MS
    });
    await this._userRepository.updateOne({ id: user.id }, { token: getToken }, user);
    $logger.info(`Token create for user`, { user, getToken });
    return { ...user, token: getToken, expiresIn: config.JWT_EXPIRES_MS };
  }
}
