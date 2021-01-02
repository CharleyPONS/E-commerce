import { EntityRepository, FindConditions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { WinstonLogger } from '../../../core/services/winstonLogger';
import { UserEntity } from '../../User/entities/user.entity';
import { UserOrderedEntity } from '../entities/userOrdered.entity';

@EntityRepository(UserOrderedEntity)
export class UserOrderedRepository extends Repository<UserOrderedEntity> {
  async findById(userOrderId: number): Promise<any> {
    try {
      new WinstonLogger().logger().info(`Search a userOrdered with id ${userOrderId}`);
      const userOrdered = await this.findOne({
        where: { id: userOrderId },
        relations: ['product', 'user']
      });
      return userOrdered;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a userOrdered with id ${userOrderId} request failed`, { error: err });
    }
  }

  async findByUserId(userId: string): Promise<any> {
    try {
      new WinstonLogger().logger().info(`Search a userOrdered with userid ${userId}`);
      const userOrdered = await this.findOne({
        where: { userId },
        relations: ['product']
      });
      return userOrdered;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a userOrdered with user id ${userId} request failed`, { error: err });
    }
  }

  async saveUserOrder(userOrdered: UserOrderedEntity): Promise<any> {
    try {
      new WinstonLogger().logger().info(`Save userOrdered`, { userOrdered });
      await this.save(userOrdered);

      new WinstonLogger().logger().info(`Save userOrdered succeed`, { userOrdered });
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Save a userOrdered with id request failed`, { error: err });
    }
  }

  async updateOne(
    filter: FindConditions<UserOrderedEntity>,
    updateQuery: QueryDeepPartialEntity<UserOrderedEntity>,
    userOrdered: UserOrderedEntity | UserEntity
  ): Promise<any> {
    try {
      new WinstonLogger().logger().info(`update userOrdered`, { userOrdered });
      await this.update(filter, updateQuery);
      new WinstonLogger().logger().info(`Update userOrdered succeed`, { userOrdered });
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Update a userOrdered with id request failed`, { error: err });
    }
  }

  async deleteUser(userId: number): Promise<any> {
    try {
      new WinstonLogger().logger().info(`try todelete userOrdered`, { userId });
      await this.delete({ id: userId });
      new WinstonLogger().logger().info(`Delete userOrdered succeed`, { userId });
      return;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Delete a userOrdered with id ${userId} failed`, { error: err });
    }
  }
}
