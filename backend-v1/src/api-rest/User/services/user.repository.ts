import { Inject, Service } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { FilterQuery, UpdateQuery } from 'mongoose';

import { WinstonLogger } from '../../../Core/services/winston-logger';
import { UserModel } from '../models/user.model';

@Service()
export class UserRepository {
  @Inject(UserModel)
  private user: MongooseModel<UserModel>;

  $onInit() {}

  async findById(id: string): Promise<any> {
    try {
      new WinstonLogger().logger().info(`Search a user with id ${id}`);
      const user = await this.user.findById(id);
      return user;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a user with id ${id} request failed`, { error: err });
    }
  }

  async findByEmail(email: string): Promise<any> {
    try {
      new WinstonLogger().logger().info(`Search a user with id ${email}`);
      const user = await this.user.findOne({ email }).exec();
      return user;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a user with id ${email} request failed`, { error: err });
    }
  }

  async findByUserId(userId: string): Promise<any> {
    try {
      new WinstonLogger().logger().info(`Search a user with id ${userId}`);
      const user = await this.user.findOne({ userId }).exec();
      return user;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a user with id ${userId} request failed`, { error: err });
    }
  }

  async save(user: UserModel): Promise<any> {
    try {
      const model = new this.user(user);
      new WinstonLogger().logger().info(`Save user`, { user });
      await model.save();
      new WinstonLogger().logger().info(`Save user succeed`, { user });

      return model;
    } catch (err) {
      new WinstonLogger().logger().warn(`Save a user with id request failed`, { error: err });
    }
  }

  async updateOne(
    filter: FilterQuery<UserModel>,
    updateQuery: UpdateQuery<UserModel>,
    user: UserModel
  ): Promise<any> {
    try {
      new WinstonLogger().logger().info(`update user`, { user });
      await this.user.updateOne(filter, updateQuery);
      new WinstonLogger().logger().info(`Update user succeed`, { user });
    } catch (err) {
      new WinstonLogger().logger().warn(`Update a user with id request failed`, { error: err });
    }
  }

  async delete(userId: string): Promise<any> {
    try {
      new WinstonLogger().logger().info(`try to delete user`, { userId });
      await this.user.deleteOne({ __id: userId });
      new WinstonLogger().logger().info(`Delete user succeed`, { userId });
      return;
    } catch (err) {
      new WinstonLogger().logger().warn(`Delete a user with id ${userId} failed`, { error: err });
    }
  }
}
