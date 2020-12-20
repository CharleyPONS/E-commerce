import '@tsed/ajv';
import { PlatformApplication } from '@tsed/common';
import { Configuration, Inject } from '@tsed/di';
import '@tsed/mongoose';
import '@tsed/platform-express'; // /!\ keep this import
// @ts-ignore
import autoimport from 'auto-import';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import expressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import methodOverride from 'method-override';

import mongooseConfig from './core/config/mongoose';
import { IdDb } from './core/models/enum/id-db.enum';
import DbConnectService from './core/services/db-connect.service';
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
  mongoose: mongooseConfig,
  exclude: ['**/*.spec.ts']
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;
  constructor(private _dbConnectService: DbConnectService) {}

  public async $beforeInit() {
    new WinstonLogger().logger().info(`${process.env.CLUSTER_URL} okok `);
    await this._dbConnectService.connectDB(IdDb.SHOP_DATABASE, process.env.CLUSTER_URL || '');
  }

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
      .use(expressMongoSanitize())
      .use(bodyParser.json({ limit: '10mb' }))
      .use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
      .use(helmet());
  }
}
