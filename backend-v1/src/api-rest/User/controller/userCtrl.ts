import {
  BodyParams,
  Context,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  QueryParams
} from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Status, Summary } from '@tsed/schema';

import axios from 'axios';
import { WinstonLogger } from '../../../core/services/winstonLogger';
import { UserEntity } from '../entities/user.entity';
import { UserAddressEntity } from '../entities/userAddress.entity';
import { IUser } from '../models/user.interface';
import { UserRepository } from '../services/user.repository';
import { UserAddressRepository } from '../services/userAddress.repository';
import { UserDeleteTokenService } from '../services/userDeleteToken.service';
import { UserLogInService } from '../services/userLogIn.service';
import { sign } from 'jsonwebtoken';

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

  @Get('/:token')
  @Summary('Return a User from his ID')
  @(Status(200, UserEntity).Description('Success'))
  async getUser(@PathParams('token') token: string): Promise<UserEntity> {
    const user = await this._userRepository.findByToken(token);

    if (user) {
      return user;
    }

    throw new NotFound('User not present');
  }

  @Post('/oauth')
  @Summary('Return a User from his ID')
  @(Status(200, UserEntity).Description('Success'))
  async oauthFacebookStrategy(
    @Context() ctx: Context,
    @BodyParams() authToken: { ssoToken: string }
  ): Promise<any> {
    const userFbData = await axios.get(
      `https://graph.facebook.com/me?fields=email,name&access_token=${encodeURIComponent(
        authToken?.ssoToken
      )}`
    );
    if (userFbData?.status === 200) {
      const userToSave: UserEntity = new UserEntity();
      userToSave.email = userFbData?.data?.email;
      userToSave.name = userFbData?.data?.name;
      userToSave.fromSSO = true;
      await this._userRepository.saveUser(userToSave);
    }
    const user = await this._userRepository.findByEmail(userFbData?.data?.email);
    if (!user) {
      new WinstonLogger().logger().info(`user not found`, { user });
      throw new Error('user not found error during the save process');
    }

    const getToken: string = sign({ id: user.id }, process.env.JWT_KEY as string, {
      expiresIn: process.env.JWT_EXPIRES_MS
    });
    await this._userRepository.updateOne({ id: user.id }, { token: getToken }, user);

    ctx
      .getResponse()
      .status(200)
      .send({ ...user, token: getToken, expiresIn: process.env.JWT_EXPIRES_MS });
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
  async logInUser(@Context() ctx: Context, @BodyParams() userBody: IUser): Promise<UserEntity> {
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
    const userSaved = await this._userRepository.findById(user?.userId as string);
    if (updateUser) {
      new WinstonLogger().logger().info(`Update user done`, { userSaved });

      return ctx.getResponse().status(200).send(userSaved);
    } else {
      new WinstonLogger().logger().warn(`Update user failed`, { updateUser });

      return ctx.getResponse().status(404).send('user not save');
    }
  }
}
