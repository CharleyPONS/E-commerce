import { EntityRepository, FindConditions, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { $logger } from '../../../core/services/customLogger';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '../models/user.interface';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  $onInit() {}

  async findById(idUser: string): Promise<UserEntity | undefined> {
    $logger.info(`Search a user with id ${idUser}`);
    return this.findOne({
      where: { userId: idUser },
      relations: ['address']
    });
  }

  async findByEmail(userEmail: string): Promise<UserEntity | undefined> {
    $logger.info(`Search a user with email ${userEmail}`);
    const user = await this.findOne({
      where: { email: userEmail },
      relations: ['address']
    });
    return user;
  }

  async findByToken(tokenId: string): Promise<UserEntity | undefined> {
    $logger.info(`Search a user with token ${tokenId}`);
    const user = await this.findOne({
      where: { token: tokenId }
    });
    return user;
  }

  async saveUser(user: UserEntity): Promise<void> {
    await this.save(user);
    $logger.info(`Save user succeed`, { user });
    return;
  }

  async updateOne(
    filter: FindConditions<UserEntity>,
    updateQuery: QueryDeepPartialEntity<UserEntity>,
    user: IUser | UserEntity
  ): Promise<UpdateResult> {
    const updateUser = await this.update(filter, updateQuery);
    $logger.info(`Update user succeed`, { user });
    return updateUser;
  }

  async deleteUser(userId: number): Promise<any> {
    try {
      $logger.info(`try to delete user`, { userId });
      await this.delete({ id: userId });
      $logger.info(`Delete user succeed`, { userId });
      return;
    } catch (err) {
      $logger.warn(`Delete a user with id ${userId} failed`, { error: err });
    }
  }
}
