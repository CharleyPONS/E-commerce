import '@tsed/ajv';
import { PlatformApplication } from '@tsed/common';
import { Configuration, Inject } from '@tsed/di';
import '@tsed/platform-express'; // /!\ keep this import
import { TypeORMService } from '@tsed/typeorm';
// @ts-ignore
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import methodOverride from 'method-override';

import { WinstonLogger } from './core/services/winston-logger';

export const rootDir = __dirname;
dotenv.config();

@Configuration({
  rootDir,
  acceptMimes: ['application/json'],
  httpPort: process.env.PORT || 5000,
  httpsPort: false, // CHANGE
  mount: {
    '/api/rest': [`${rootDir}/**/controller/**/*.ts`]
  },
  ajv: {},
  componentsScan: [
    `${rootDir}/core/middlewares/*.middleware.ts`,
    `${rootDir}/api-rest/**/**/*.middleware.ts`,
    `${rootDir}/core/services/*.services.ts`,
    `${rootDir}/api-rest/**/**/*.services.ts`
  ],
  typeorm: [
    {
      name: 'default',
      type: 'postgres',
      host: process.env.POSTGRES_URL,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      logging: false,
      entities: [`${rootDir}/**/entities/**/*.ts`]
    }
  ],
  exclude: ['**/*.spec.ts']
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;
  constructor(private _typeORMService: TypeORMService) {}

  $beforeRoutesInit(): void {
    this.app
      .use(
        cors({
          origin: process.env.CORS_ORIGIN || '*',
          methods: ['GET', 'POST', 'DELETE']
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json({ limit: '10mb' }))
      .use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
      .use(helmet());
  }

  $afterRoutesInit(): void | Promise<any> {
    new WinstonLogger().logger().info(this._typeORMService.get());
  }
}
