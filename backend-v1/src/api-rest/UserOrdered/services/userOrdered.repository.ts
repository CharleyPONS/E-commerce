import { EntityRepository, FindConditions, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { $logger } from '../../../core/services/customLogger';
import { UserEntity } from '../../User/entities/user.entity';
import { UserOrderedEntity } from '../entities/userOrdered.entity';

@EntityRepository(UserOrderedEntity)
export class UserOrderedRepository extends Repository<UserOrderedEntity> {
  async findById(userOrderId: number): Promise<any> {
    $logger.info(`Search a userOrdered with id ${userOrderId}`);
    return this.findOne({
      where: { id: userOrderId },
      relations: ['product', 'user']
    });
  }

  async findByUserIdAndUserOrderedId(user: string, userOrder: string): Promise<any> {
    $logger.info(`Search a userOrdered with userid ${user}`);
    return this.findOne({
      where: { userId: user, userOrderedId: userOrder },
      relations: ['product']
    });
  }

  async saveUserOrder(userOrdered: UserOrderedEntity): Promise<any> {
    const saveUserOrdered = await this.save(userOrdered);

    $logger.info(`Save userOrdered succeed`, { userOrdered });
    return saveUserOrdered;
  }

  async updateOne(
    filter: FindConditions<UserOrderedEntity>,
    updateQuery: QueryDeepPartialEntity<UserOrderedEntity>,
    userOrdered: UserOrderedEntity | UserEntity
  ): Promise<UpdateResult> {
    const updateOrder: UpdateResult = await this.update(filter, updateQuery);
    $logger.info(`Update userOrdered succeed`, { userOrdered });
    return updateOrder;
  }

  async deleteUserOrdered(userIdParam: string): Promise<any> {
    await this.delete({ userId: userIdParam });
    $logger.info(`Delete userOrdered succeed`, { userIdParam });
    return;
  }

  async findAll(): Promise<UserOrderedEntity[]> {
    $logger.info(`Find all product`);
    const userOrdered: UserOrderedEntity[] = await this.find({ relations: ['product'] });
    return userOrdered;
  }
}
