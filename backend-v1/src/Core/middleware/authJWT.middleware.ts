import { Context, IMiddleware, Middleware } from '@tsed/common';
import { verify } from 'jsonwebtoken';

import { WinstonLogger } from '../services/winston-logger';

@Middleware()
export class AuthJWTMiddleware implements IMiddleware {
  constructor() {}
  async use(@Context() ctx: Context): Promise<void> {
    const token: string = ctx?.request?.headers['x-access-token'] as string;
    if (!token) {
      new WinstonLogger().logger().info('no token provided');
      return ctx.getResponse().status(404).send('no token provided in request headers');
    }
    verify(token, process.env.JWT_KEY as string, (err, decoded) => {
      if (err) {
        if (err?.name === 'TokenExpiredError') {
          new WinstonLogger().logger().info('TokenExpiredError', { err });
          return ctx.getResponse().status(404).send('TokenExpiredError');
        }
        new WinstonLogger().logger().info('error during token verification', { err });
        return ctx.getResponse().status(404).send('token cannot be verified');
      }
    });
    return;
  }
}
