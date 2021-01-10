import { Context, IMiddleware, Middleware } from '@tsed/common';
import { verify } from 'jsonwebtoken';

import { $logger } from '../services/customLogger';
import { config } from '../config';
import { NotFound } from '@tsed/exceptions';

@Middleware()
export class AuthJWTMiddleware implements IMiddleware {
  constructor() {}
  async use(@Context() ctx: Context): Promise<void> {
    const token: string = ctx?.request?.headers['x-access-token'] as string;
    if (!token) {
      $logger.info('no token provided');
      throw new NotFound('no token provided in request headers');
    }
    verify(token, config.JWT_KEY as string, (err, decoded) => {
      if (err) {
        if (err?.name === 'TokenExpiredError') {
          $logger.info('TokenExpiredError', { err });
          throw new NotFound('TokenExpiredError');
        }
        $logger.info('error during token verification', { err });
        throw new NotFound('token cannot be verified');
      }
    });
    return;
  }
}
