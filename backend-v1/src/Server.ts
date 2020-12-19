import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/mongoose";
import mongooseConfig from "./core/config/mongoose";
import {IdDb} from "./core/models/enum/id-db.enum";
import DbConnectService from "./core/db-connect.service";
import {WinstonLogger} from "./core/winston-logger";
import '@tsed/ajv';

import * as dotenv from 'dotenv';
// @ts-ignore
import autoimport from 'auto-import';
import helmet from 'helmet';
import expressMongoSanitize from "express-mongo-sanitize";


export const rootDir = __dirname;
dotenv.config();

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 5000,
  httpsPort: false, // CHANGE
  mount: {
    "/api/rest": [
      `${rootDir}/**/controller/**/*.ts`
    ]
  },
  ajv: {

  },
  componentsScan: [
    `${rootDir}/core/middlewares/*.middleware.ts`,
    `${rootDir}/api/**/**/*.middleware.ts`,
    `${rootDir}/core/services/*.services.ts`,
    `${rootDir}/api/**/**/*.services.ts`
  ],
  mongoose: mongooseConfig,
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  constructor(private _dbConnectService: DbConnectService){

  }
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  public async $beforeInit() {
    new WinstonLogger().logger().info(`${process.env.CLUSTER_URL} okok `)
    await this._dbConnectService.connectDB(IdDb.SHOP_DATABASE, process.env.CLUSTER_URL || '');
  }

    $beforeRoutesInit(): void {
    this.app
      .use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'DELETE']
      }))
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(expressMongoSanitize())
    .use(bodyParser.json({ limit: '10mb' }))
        .use(bodyParser.urlencoded({ limit: '10mb', extended: true })
        )
        .use(helmet())
  }
}
