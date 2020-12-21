import { Service } from '@tsed/common';

import { WinstonLogger } from '../../../core/services/winston-logger';
import { UserEntity } from '../models/user.entity';

import { UserRepository } from './user.repository';

@Service()
export class UserDeleteTokenService {
  constructor(private _userRepository: UserRepository) {}
  async main(user: UserEntity): Promise<void> {
    try {
      new WinstonLogger().logger().info(`try to delete token`, { user: user.userId });
      await this._userRepository.updateOne({ _id: user.userId }, { $unset: { token: 1 } }, user);
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Delete a token user with id ${user.userId} failed`, { error: err });
    }
  }
}
