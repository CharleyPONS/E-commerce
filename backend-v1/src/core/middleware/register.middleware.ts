import { Context, IMiddleware, Middleware } from '@tsed/common';

import { Unauthorized } from '@tsed/exceptions';
import { UserRepository } from '../../api-rest/User/services/user.repository';
import { $logger } from '../services/customLogger';

@Middleware()
export class RegisterMiddleware implements IMiddleware {
  constructor(private _userService: UserRepository) {}
  async use(@Context() ctx: Context): Promise<void> {
    const result = await this._userService.findByEmail(ctx.request.body.email);
    if (result) {
      $logger.warn('email already use', { email: ctx.request.body.email });
      throw new Unauthorized('email already use');
    }
    return;
  }
}
