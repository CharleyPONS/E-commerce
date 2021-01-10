import { Configuration, registerProvider } from '@tsed/di';
import { createConnection } from '@tsed/typeorm';
import { ConnectionOptions } from 'typeorm';
import { config } from '../config';

export const CONNECTION = Symbol.for('CONNECTION');

registerProvider({
  provide: CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    const settings = configuration.get<ConnectionOptions[]>(config.ORM_USED)!;
    const connectionOptions = settings.find(o => o.name === config.CONNECTION_NAME);

    return createConnection(connectionOptions!);
  }
});
