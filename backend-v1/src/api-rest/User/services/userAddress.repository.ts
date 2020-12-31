import { EntityRepository, FindConditions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { WinstonLogger } from '../../../core/services/winstonLogger';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '../models/user.interface';
import { UserAddressEntity } from '../entities/userAddress.entity';
import { IUserAddress } from '../models/userAdress.interface';

@EntityRepository(UserAddressEntity)
export class UserAddressRepository extends Repository<UserAddressEntity> {
  $onInit() {}

  async saveUserAdress(userAdress: UserAddressEntity): Promise<void> {
    try {
      new WinstonLogger().logger().info(`Save user`, { userAdress });
      await this.save(userAdress);
      new WinstonLogger().logger().info(`Save user succeed`, { userAdress });
    } catch (err) {
      new WinstonLogger().logger().warn(`Save a user with id request failed`, { error: err });
    }
  }

  async updateOne(
    filter: FindConditions<UserAddressEntity>,
    updateQuery: QueryDeepPartialEntity<UserAddressEntity>,
    userAddress: IUserAddress | UserAddressEntity
  ): Promise<any> {
    try {
      new WinstonLogger().logger().info(`update user`, { userAddress });
      const updateUser = await this.update(filter, updateQuery);
      new WinstonLogger().logger().info(`Update user succeed`, { userAddress });
      return updateUser;
    } catch (err) {
      new WinstonLogger().logger().warn(`Update a user with id request failed`, { error: err });
    }
  }

  async findByAddress(address: string): Promise<UserAddressEntity | undefined> {
    try {
      new WinstonLogger().logger().info(`Search a user address with address ${address}`);
      const userAddress = await this.findOne({
        where: { street: address }
      });
      return userAddress;
    } catch (err) {
      new WinstonLogger()
        .logger()
        .warn(`Search a user address with address ${address} request failed`, { error: err });
    }
  }
}
