import { Inject, Service } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { FilterQuery, UpdateQuery } from 'mongoose';

import { WinstonLogger } from '../../../core/services/winston-logger';
import { UserOrderedModel } from '../models/userOrdered.model';

@Service()
export class UserCommandRepository {
  @Inject(UserOrderedModel)
  private userOrdered: MongooseModel<UserOrderedModel>;

  async findById(id: string): Promise<any> {
    try {
      new WinstonLogger().logger().info(`Search a userOrdered with id ${id}`);
      const userOrdered = await this.userOrdered.findById(id).exec();
      return userOrdered;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a userOrdered with id ${id} request failed`, { error: err });
    }
  }

  async save(userOrdered: UserOrderedModel): Promise<any> {
    try {
      const model = new this.userOrdered(userOrdered);
      new WinstonLogger().logger().info(`Save userOrdered`, { userOrdered });
      await model.save();
      new WinstonLogger().logger().info(`Save userOrdered succeed`, { userOrdered });
      return model;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Save a userOrdered with id request failed`, { error: err });
    }
  }

  async updateOne(
    filter: FilterQuery<UserOrderedModel>,
    updateQuery: UpdateQuery<UserOrderedModel>,
    userOrdered: UserOrderedModel
  ): Promise<any> {
    try {
      new WinstonLogger().logger().info(`update userOrdered`, { userOrdered });
      await this.userOrdered.updateOne(filter, updateQuery);
      new WinstonLogger().logger().info(`Update userOrdered succeed`, { userOrdered });
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Update a userOrdered with id request failed`, { error: err });
    }
  }

  async delete(userId: string): Promise<any> {
    try {
      new WinstonLogger().logger().info(`try todelete userOrdered`, { userId });
      await this.userOrdered.deleteOne({ __id: userId });
      new WinstonLogger().logger().info(`Delete userOrdered succeed`, { userId });
      return;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Delete a userOrdered with id ${userId} failed`, { error: err });
    }
  }
}
