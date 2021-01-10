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
import * as fs from 'fs-extra';
import helmet from 'helmet';
import methodOverride from 'method-override';
import { createLogger } from 'winston';
import { config } from './core/config';

export const rootDir = __dirname;
dotenv.config();
const keyCertificate = fs.readFileSync(__dirname + '/certificates/localhost.key');
const certificate = fs.readFileSync(__dirname + '/certificates/localhost.crt');

@Configuration({
  rootDir,
  acceptMimes: ['application/json'],
  httpPort: false,
  httpsPort: config.PORT,
  httpsOptions: {
    cert: certificate,
    key: keyCertificate
  },
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
      host: config.POSTGRES_URL,
      port: 5432,
      username: config.POSTGRES_USER,
      password: config.POSTGRES_PASSWORD,
      database: config.POSTGRES_DB,
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
    createLogger();
    this.app
      .use(
        cors({
          origin: (config.CORS_ORIGIN as string)?.split(',') || '*',
          methods: ['GET', 'POST', 'DELETE']
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use('/api/rest/user-payment/stripe-webhook-success', bodyParser.raw({ type: '*/*' }))
      .use(bodyParser.json({ limit: '10mb' }))
      .use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
      .use(helmet());
  }
}
