import { Service } from '@tsed/common';

import { WinstonLogger } from '../../../core/services/winstonLogger';
import { UserEntity } from '../entities/user.entity';

import { UserRepository } from './user.repository';

@Service()
export class UserDeleteTokenService {
  constructor(private _userRepository: UserRepository) {}
  async main(user: UserEntity): Promise<void> {
    try {
      new WinstonLogger().logger().info(`try to delete token`, { user: user.id });
      await this._userRepository.updateOne({ id: user.id }, { token: null }, user);
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Delete a token user with id ${user.id} failed`, { error: err });
    }
  }
}
