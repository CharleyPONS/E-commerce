// noinspection TypeScriptCheckImport

import * as winston from "winston";

export class WinstonLogger {
public options: any;

constructor(){
    this.options = {
        file: {
            level: 'info',
            filename: `${new Date().toUTCString()}/${process.env.LOGGER_FILE}`,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
        },
    };
}

public logger(){
    return  winston.createLogger({
        transports: [
            new winston.transports.File(this.options.file),
            new winston.transports.Console(this.options.console)
        ],
        exitOnError: false
    });
}

}
