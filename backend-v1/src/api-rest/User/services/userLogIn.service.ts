import { Context, Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { WinstonLogger } from '../../../core/services/winston-logger';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '../models/user.interface';

import { UserRepository } from './user.repository';

@Service()
export class UserLogInService {
  constructor(private _userRepository: UserRepository) {}
  async main(context: Context, userBody: UserEntity): Promise<any> {
    const user: UserEntity | undefined = await this._userRepository.findByEmail(userBody.email);
    if (!user) {
      new WinstonLogger().logger().info(`User not found to login`, { userBody });
      throw new NotFound('User not found to login ');
    }
    const passwordValid: boolean = compareSync(userBody?.password, user.password);
    if (!passwordValid) {
      new WinstonLogger().logger().info(`Password wrong`, { userBody });
      context
        .getResponse()
        .status(500)
        .send({
          ...user,
          token: null
        });
    }
    const getToken: string = sign({ id: user.id }, process.env.JWT_KEY as string, {
      expiresIn: process.env.JWT_EXPIRES_MS
    });
    await this._userRepository.updateOne({ id: user.id }, { token: getToken }, user);
    new WinstonLogger().logger().info(`Token create for user`, { user, getToken });
    return { ...user, token: getToken };
  }
}
