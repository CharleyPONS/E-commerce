import { Service } from '@tsed/common';

import { $logger } from '../../../core/services/customLogger';
import { UserEntity } from '../entities/user.entity';

import { UserRepository } from './user.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class UserDeleteTokenService {
  constructor(private _userRepository: UserRepository) {}
  async main(user: UserEntity): Promise<void> {
    $logger.info(`try to delete token`, { user: user.id });
    const userUpdate = await this._userRepository.updateOne({ id: user.id }, { token: null }, user);
    if (userUpdate?.affected && userUpdate.affected < 1) {
      $logger.warn(`User to delete token not found`, { user: user.id });
      throw new NotFound('error user with token to delete not found');
    }
  }
}
