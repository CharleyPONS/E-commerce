import { Configuration, registerProvider } from '@tsed/di';
import { createConnection } from '@tsed/typeorm';
import { ConnectionOptions } from 'typeorm';

export const CONNECTION = Symbol.for('CONNECTION');

registerProvider({
  provide: CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    const settings = configuration.get<ConnectionOptions[]>(process.env.ORM_USED as string)!;
    const connectionOptions = settings.find(o => o.name === process.env.CONNECTION_NAME);

    return createConnection(connectionOptions!);
  }
});
