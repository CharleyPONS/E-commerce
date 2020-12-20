import { Service } from '@tsed/common';
import { MongooseService } from '@tsed/mongoose';
import { ConnectOptions } from 'mongoose';

import { IdDb } from '../models/enum/id-db.enum';

import { WinstonLogger } from './winston-logger';

@Service()
export default class DbConnectService {
  constructor(private _mongooseService: MongooseService) {}
  async connectDB(id: IdDb, url: string, options: ConnectOptions = { useNewUrlParser: true }) {
    if (!id || !url) {
      return;
    }
    try {
      if (this._mongooseService.has(id)) {
        new WinstonLogger().logger().info('Connection already excist');
        return;
      }
      await this._mongooseService.connect(id, url, options);
      new WinstonLogger().logger().info('Connection established');
    } catch (e) {
      new WinstonLogger().logger().warn('connection failed', {
        id,
        url
      });
    }
  }

  public async getDB(id: string) {
    return this._mongooseService.get(id);
  }

  public async closeConnection() {
    return this._mongooseService.closeConnections();
  }
}
