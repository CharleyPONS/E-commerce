import { BodyParams, Context, Controller, Delete, Get, PathParams, Post } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Status, Summary } from '@tsed/schema';

import { WinstonLogger } from '../../../core/services/winstonLogger';
import { UserEntity } from '../entities/user.entity';
import { UserAddressEntity } from '../entities/userAddress.entity';
import { IUser } from '../models/user.interface';
import { UserRepository } from '../services/user.repository';
import { UserDeleteTokenService } from '../services/userDeleteToken.service';
import { UserLogInService } from '../services/userLogIn.service';
import { UserAddressRepository } from '../services/userAddress.repository';

@Controller({
  path: '/user'
})
export class UserCtrl {
  constructor(
    private _userRepository: UserRepository,
    private _userAddressRepository: UserAddressRepository,
    private _userLoginService: UserLogInService,
    private _userDeleteTokenService: UserDeleteTokenService
  ) {}

  @Get('/:id')
  @Summary('Return a User from his ID')
  @(Status(200, UserEntity).Description('Success'))
  async getUser(@PathParams('id') id: number): Promise<UserEntity> {
    const user = await this._userRepository.findById(id);

    if (user) {
      return user;
    }

    throw new NotFound('User not present');
  }

  @Delete('/:id')
  @Summary('Delete a User from his ID')
  @(Status(204, UserEntity).Description('Success delete'))
  async deleteUser(@PathParams('id') id: number): Promise<UserEntity> {
    const user = await this._userRepository.deleteUser(id);
    if (user) {
      return user;
    }
    throw new NotFound('User not found so not deleted');
  }

  @Post('/signIn')
  @Summary('Return JWT token if sign in succeed')
  @(Status(200, UserEntity).Description('Success'))
  async logInUser(
    @Context() ctx: Context,
    @BodyParams() userBody: UserEntity
  ): Promise<UserEntity> {
    const user: IUser = await this._userLoginService.main(ctx, userBody);
    return ctx.getResponse().status(200).send(user);
  }

  @Post('/logout')
  @Summary('Delete JWT token')
  @(Status(200).Description('Success'))
  async logOut(@Context() ctx: Context, @BodyParams('user') userBody: UserEntity): Promise<void> {
    await this._userDeleteTokenService.main(userBody);
    return;
  }

  @Post('/save')
  @Summary('Return JWT token if sign in succeed')
  @(Status(200, UserEntity).Description('Success'))
  async saveUser(@Context() ctx: Context, @BodyParams() userBody: IUser): Promise<UserEntity> {
    let user;
    if (userBody?.email) {
      user = await this._userRepository.findByEmail(userBody?.email as string);
    } else if (userBody?.token) {
      user = await this._userRepository.findByToken(userBody?.token as string);
    }
    const addressUser: UserAddressEntity = new UserAddressEntity();
    addressUser.country = userBody?.address?.country;
    addressUser.postalCode = userBody?.address?.postalCode;
    addressUser.street = userBody?.address?.street;
    addressUser.town = userBody?.address?.town;
    addressUser.userId = user?.userId ? (user?.userId as string) : null;
    await this._userAddressRepository.saveUserAdress(addressUser);
    const userToSave: UserEntity = new UserEntity();
    userToSave.name = userBody?.name;
    userToSave.surname = userBody.surname;
    userToSave.address = addressUser;
    const updateUser = await this._userRepository.updateOne(
      { userId: user?.userId },
      userToSave,
      userBody
    );
    if (updateUser) {
      new WinstonLogger().logger().info(`Update user done`, { updateUser });

      return ctx.getResponse().status(200).send(updateUser);
    } else {
      new WinstonLogger().logger().warn(`Update user failed`, { updateUser });

      return ctx.getResponse().status(404).send('user not save');
    }
  }
}
