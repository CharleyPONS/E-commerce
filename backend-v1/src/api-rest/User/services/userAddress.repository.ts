import { EntityRepository, FindConditions, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { $logger } from '../../../core/services/customLogger';
import { UserAddressEntity } from '../entities/userAddress.entity';
import { IUserAddress } from '../models/userAdress.interface';

@EntityRepository(UserAddressEntity)
export class UserAddressRepository extends Repository<UserAddressEntity> {
  $onInit() {}

  async saveUserAdress(userAdress: UserAddressEntity): Promise<void> {
    await this.save(userAdress);
    $logger.info(`Save user succeed`, { userAdress });
    return;
  }

  async updateOne(
    filter: FindConditions<UserAddressEntity>,
    updateQuery: QueryDeepPartialEntity<UserAddressEntity>,
    userAddress: IUserAddress | UserAddressEntity
  ): Promise<UpdateResult> {
    const updateUser = await this.update(filter, updateQuery);
    $logger.info(`Update user succeed`, { userAddress });
    return updateUser;
  }

  async findByAddress(address: string): Promise<UserAddressEntity | undefined> {
    $logger.info(`Search a user address with address ${address}`);
    const userAddress = await this.findOne({
      where: { street: address }
    });
    return userAddress;
  }
}
