import { Context, Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { isEqual, merge } from 'lodash';

import { WinstonLogger } from '../../../core/services/winston-logger';
import { IUser } from '../../User/models/user.interface';
import { UserRepository } from '../../User/services/user.repository';
import { UserOrderedEntity } from '../entities/userOrdered.entity';

import { UserCommandRepository } from './userCommand.repository';
import { UserEntity } from '../../User/entities/user.entity';

@Service()
export class UserCommandService {
  constructor(
    private _userRepository: UserRepository,
    private _userCommandRepository: UserCommandRepository
  ) {}
  async main(context: Context, userCommand: UserOrderedEntity): Promise<void> {
    const user: UserEntity | undefined = await this._userRepository.findById(userCommand?.id);
    if (!user) {
      new WinstonLogger().logger().info(`User not found to login`, { userCommand });
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
        new WinstonLogger()
          .logger()
          .info(`Command already store no need to update`, { userCommand });
        return;
      }
      await this._userCommandRepository.updateOne(
        { id: userCommand.id },
        merge(command, userCommand),
        merge(command, userCommand)
      );
      context.getResponse().status(204).send('order update');
    } else {
      await this._userCommandRepository.save(userCommand);
      context.getResponse().status(204).send('order create');
    }
  }
}
