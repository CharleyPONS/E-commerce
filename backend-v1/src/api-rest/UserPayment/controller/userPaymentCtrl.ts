import { BodyParams, Context, Controller, PathParams, Post, UseBefore } from '@tsed/common';
import { Required, Summary } from '@tsed/schema';

import { AuthJWTMiddleware } from '../../../core/middleware/authJWT.middleware';
import { StripePaymentService } from '../../../core/services/stripePayment.service';
import { IListOrderInterface } from '../models/listOrderInterface';
import { getConnection } from 'typeorm';
import { UserEntity } from '../../User/entities/user.entity';

@Controller({
  path: '/user-payment'
})
export class UserPaymentCtrl {
  constructor(private _stripePaymentService: StripePaymentService) {}

  @Post('/intent-payment')
  @Summary('Return all Product')
  @UseBefore(AuthJWTMiddleware)
  async registerUser(
    @Context() ctx: Context,
    @Required() @PathParams('userId') userId: number,
    @BodyParams('listOrder')
    listOrder: IListOrderInterface
  ): Promise<void> {
    const secretClient: {
      clientSecret: string | null;
    } = await this._stripePaymentService.main(userId, listOrder);
    ctx.getResponse().status(200).send(secretClient);
  }

  @Post('/stripe-webhook-success')
  @Summary('Response hook from stripe and update db')
  async successPaymentHook(@Context() ctx: Context): Promise<void>{
    let responseStripe;
    try {
      responseStripe = JSON.parse(ctx.request.body);
    } catch (err) {
      return ctx.getResponse().status(500).send();
    }
    //TODO let the switch case for more hook set in the future
    //TODO Update entity with transaction
    switch (responseStripe.type) {
      case 'payment_intent.succeeded':
        await getConnection().transaction(async transactionalEntityManager => {
          await transactionalEntityManager.find(UserEntity,{})
        });
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

// establish real database connection using our new query runner
        await queryRunner.connect();

// now we can execute any queries on a query runner, for example:

// we can also access entity manager that works with connection created by a query runner:
        const users = await queryRunner.manager.find(User);

// lets now open a new transaction:
        await queryRunner.startTransaction();

        try {

          // execute some operations on this transaction:
          await queryRunner.manager.save(user1);
          await queryRunner.manager.save(user2);
          await queryRunner.manager.save(photos);

          // commit transaction now:
          await queryRunner.commitTransaction();

        } catch (err) {

          // since we have errors let's rollback changes we made
          await queryRunner.rollbackTransaction();

        } finally {

          // you need to release query runner which is manually created:
          await queryRunner.release();
        }
        const paymentIntent = responseStripe.data.object;
        break;
    }
    response.send();
  }
}
