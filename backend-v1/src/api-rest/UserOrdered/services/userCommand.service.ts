import { Context, Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { isEqual, merge } from 'lodash';

import { $logger } from '../../../core/services/customLogger';
import { UserEntity } from '../../User/entities/user.entity';
import { UserRepository } from '../../User/services/user.repository';
import { UserOrderedEntity } from '../entities/userOrdered.entity';

import { UserOrderedRepository } from './userOrdered.repository';

@Service()
export class UserCommandService {
  constructor(
    private _userRepository: UserRepository,
    private _userCommandRepository: UserOrderedRepository
  ) {}
  async main(context: Context, userCommand: UserOrderedEntity): Promise<void> {
    const user: UserEntity | undefined = await this._userRepository.findById(userCommand?.userId);
    if (!user) {
      $logger.info(`User not found to login`, { userCommand });
      throw new NotFound('User not found to login ');
    }
    await this._userRepository.updateOne(
      { id: userCommand?.id },
      {
        numberOrder: user.numberOrder ? parseInt(String(user.numberOrder), 10) + 1 : 1
      },
      user
    );
    const command: UserOrderedEntity = await this._userCommandRepository.findById(userCommand.id);
    if (command) {
      if (isEqual(command, userCommand)) {
        $logger.info(`Command already store no need to update`, { userCommand });
        return;
      }
      await this._userCommandRepository.updateOne(
        { id: userCommand.id },
        merge(command, userCommand),
        merge(command, userCommand)
      );
      return;
    } else {
      await this._userCommandRepository.save(userCommand);
      return;
    }
  }
}
