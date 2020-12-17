import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/mongoose";
import mongooseConfig from "./config/mongoose";
import {IdDb} from "./core/models/id-db.enum";
import DbConnectService from "./core/db-connect.service";
import {firebase} from "./core";


export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {
    "api/rest": [
      `${rootDir}/controllers/**/*.ts`
    ]
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
    await this._dbConnectService.connectDB(IdDb.SHOP_DATABASE, process.env.CLUSTER_URL || '');
    firebase.connect();
  }

    $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }
}
