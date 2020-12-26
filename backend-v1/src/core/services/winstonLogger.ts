// noinspection TypeScriptCheckImport

import * as winston from 'winston';

export class WinstonLogger {
  public options: any;
  //TODO pas urgent mais faut changer la gestion du fichier parce que la meme si c'est provisoire ca me soule
  constructor() {
    this.options = {
      file: {
        level: 'info',
        filename: `${process.env.LOGGER_FILE}/${new Date().toUTCString()}`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false
      },
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
      }
    };
  }

  public logger() {
    return winston.createLogger({
      transports: [
        new winston.transports.File(this.options.file),
        new winston.transports.Console(this.options.console)
      ],
      exitOnError: false
    });
  }
}
