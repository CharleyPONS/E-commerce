import {
  BodyParams,
  Context,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  UseBefore
} from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Required, Returns, Summary } from '@tsed/schema';
import axios from 'axios';
import { hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { config } from '../../../core/config';
import { AuthJWTMiddleware } from '../../../core/middleware/authJWT.middleware';
import { MailProcess } from '../../../core/models/enum/mailProcess.enum';
import { $logger } from '../../../core/services/customLogger';
import { EmailSenderService } from '../../../core/services/emailSender.service';
import { UserEntity } from '../entities/user.entity';
import { UserAddressEntity } from '../entities/userAddress.entity';
import { IUser } from '../models/user.interface';
import { UserRepository } from '../services/user.repository';
import { UserAddressRepository } from '../services/userAddress.repository';
import { UserDeleteTokenService } from '../services/userDeleteToken.service';
import { UserLogInService } from '../services/userLogIn.service';

@Controller({
  path: '/user'
})
export class UserCtrl {
  constructor(
    private _userRepository: UserRepository,
    private _userAddressRepository: UserAddressRepository,
    private _userLoginService: UserLogInService,
    private _userDeleteTokenService: UserDeleteTokenService,
    private _emailSenderService: EmailSenderService
  ) {}

  @Get('/:token')
  @Summary('Return a User from his ID')
  @(Returns(200, UserEntity).Description('Success'))
  async getUser(@PathParams('token') token: string): Promise<UserEntity> {
    const user = await this._userRepository.findByToken(token);

    if (user) {
      return user;
    }

    throw new NotFound('User not present');
  }

  @Post('/oauth')
  @Summary('Return a User from his ID')
  @(Returns(200, UserEntity).Description('Success'))
  async oauthFacebookStrategy(
    @Context() ctx: Context,
    @BodyParams() authToken: { ssoToken: string }
  ): Promise<any> {
    const userFbData = await axios.get(
      `https://graph.facebook.com/me?fields=email,name&access_token=${encodeURIComponent(
        authToken?.ssoToken
      )}`
    );
    const userToSave: UserEntity = new UserEntity();
    if (userFbData?.status === 200) {
      userToSave.email = userFbData?.data?.email;
      userToSave.name = userFbData?.data?.name;
      userToSave.fromSSO = true;
    }
    const user = await this._userRepository.findByEmail(userFbData?.data?.email);
    if (!user) {
      $logger.info(`user not found we save user`, { user });
      await this._userRepository.saveUser(userToSave);
    } else {
      const getToken: string = sign({ id: user.id }, config.JWT_KEY as string, {
        expiresIn: config.JWT_EXPIRES_MS
      });
      await this._userRepository.updateOne({ id: user.id }, { token: getToken }, user);
    }
    const userToSend = await this._userRepository.findByEmail(userFbData?.data?.email);

    return {
      ...userToSend,
      token: userToSend?.token || null,
      expiresIn: config.JWT_EXPIRES_MS
    };
  }

  @Delete('/:id')
  @Summary('Delete a User from his ID')
  @(Returns(204, UserEntity).Description('Success delete'))
  async deleteUser(@PathParams('id') id: number): Promise<UserEntity> {
    const user = await this._userRepository.deleteUser(id);
    if (user) {
      return user;
    }
    throw new NotFound('User not found so not deleted');
  }

  @Post('/signIn')
  @Summary('Return JWT token if sign in succeed')
  @(Returns(200, UserEntity).Description('Success'))
  async logInUser(@Context() ctx: Context, @BodyParams() userBody: IUser): Promise<IUser> {
    const user: IUser = await this._userLoginService.main(ctx, userBody);
    return user;
  }

  @Post('/logout')
  @Summary('Delete JWT token')
  @(Returns(200).Description('Success'))
  async logOut(@Context() ctx: Context, @BodyParams('user') userBody: UserEntity): Promise<void> {
    await this._userDeleteTokenService.main(userBody);
    return;
  }

  @Post('/changePassword')
  @Summary('Change userpassword')
  @UseBefore(AuthJWTMiddleware)
  async changePassword(
    @Context() ctx: Context,
    @Required()
    @PathParams('token')
    token: string,
    @Required()
    @BodyParams()
    password: { password: string }
  ): Promise<void> {
    const user = await this._userRepository.findByToken(token);
    if (!user) {
      $logger.info(`user not found`, { token });
      throw new Error('User who want to change password not found');
    }
    const userToSave: UserEntity = new UserEntity();
    userToSave.password = hashSync(password.password, 10);
    await this._userRepository.updateOne({ id: user?.id }, { password: userToSave.password }, user);
  }

  @Post('/forgotPassword')
  @Summary('send mail with new password')
  @(Returns(200).Description('Email send for new password'))
  async forgotPassword(
    @Context() ctx: Context,
    @Required()
    @BodyParams()
    email: { email: string }
  ): Promise<void> {
    const user = await this._userRepository.findByEmail(email.email);
    if (!user) {
      $logger.info(`user not found`, { email });
      throw new Error('email not found');
    }
    await this._emailSenderService.main(user, MailProcess.RESET_PASSWORD);
  }

  @Post('/save')
  @Summary('Return JWT token if sign in succeed')
  @(Returns(200, UserEntity).Description('Success'))
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
    if (userSaved) {
      $logger.info(`Update user done`, { userSaved });
      return userSaved;
    } else {
      $logger.warn(`Update user failed`, { updateUser });

      throw new NotFound('user not save');
    }
  }
}
