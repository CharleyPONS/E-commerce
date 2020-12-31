import { EntityRepository, FindConditions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { WinstonLogger } from '../../../core/services/winstonLogger';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '../models/user.interface';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  $onInit() {}

  async findById(userId: string): Promise<UserEntity | undefined> {
    try {
      new WinstonLogger().logger().info(`Search a user with id ${userId}`);
      const user = await this.findOne({
        where: { id: userId },
        relations: ['address']
      });
      return user;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a user with id ${userId} request failed`, { error: err });
    }
  }

  async findByEmail(userEmail: string): Promise<UserEntity | undefined> {
    try {
      new WinstonLogger().logger().info(`Search a user with email ${userEmail}`);
      const user = await this.findOne({
        where: { email: userEmail },
        relations: ['address']
      });
      return user;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a user with email ${userEmail} request failed`, { error: err });
    }
  }

  async findByToken(tokenId: string): Promise<UserEntity | undefined> {
    try {
      new WinstonLogger().logger().info(`Search a user with token ${tokenId}`);
      const user = await this.findOne({
        where: { token: tokenId }
      });
      return user;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a user with token ${tokenId} request failed`, { error: err });
    }
  }

  async saveUser(user: UserEntity): Promise<void> {
    try {
      new WinstonLogger().logger().info(`Save user`, { user });
      await this.save(user);
      new WinstonLogger().logger().info(`Save user succeed`, { user });
    } catch (err) {
      new WinstonLogger().logger().warn(`Save a user with id request failed`, { error: err });
    }
  }

  async updateOne(
    filter: FindConditions<UserEntity>,
    updateQuery: QueryDeepPartialEntity<UserEntity>,
    user: IUser | UserEntity
  ): Promise<any> {
    try {
      new WinstonLogger().logger().info(`update user`, { user });
      const updateUser = await this.update(filter, updateQuery);
      new WinstonLogger().logger().info(`Update user succeed`, { user });
      return updateUser;
    } catch (err) {
      new WinstonLogger().logger().warn(`Update a user with id request failed`, { error: err });
    }
  }

  async deleteUser(userId: number): Promise<any> {
    try {
      new WinstonLogger().logger().info(`try to delete user`, { userId });
      await this.delete({ id: userId });
      new WinstonLogger().logger().info(`Delete user succeed`, { userId });
      return;
    } catch (err) {
      new WinstonLogger().logger().warn(`Delete a user with id ${userId} failed`, { error: err });
    }
  }
}
