import { Logger } from '@tsed/logger';
import Path from 'path';

import { rootDir } from '../../Server';
import { config } from '../config';

/**
 * Custom tsed logger with different appends
 */

export const $logger = new Logger('shop-logger');
$logger.appenders
  .set('standard-output-stream', {
    type: 'stdout',
    levels: ['debug', 'trace', 'info']
  })
  .set('standard-error', {
    type: 'stderr',
    levels: ['warn', 'error', 'fatal']
  })
  .set('file-dir', {
    type: 'file',
    filename: `${Path.join(rootDir, '..')}/${config.LOGGER_FILE}`,
    pattern: '.yyyy-MM-dd',
    daysToKeep: 10,
    compress: true
  })
  .set('email-backup', {
    type: config.HOST_MAIL_LOGGER,
    level: ['error', 'warn', 'fatal'],
    SMTP: {
      host: config.HOST_SMTP,
      auth: {
        user: config.AUTH_USER,
        pass: config.AUTH_PASSWORD
      }
    },
    attachment: {
      enable: true,
      message: "Voici les logs présentant des incidents d'une demi journée",
      filename: `${Path.join(rootDir, '..')}/${config.LOGGER_FILE}`
    },
    sendInterval: 36000,
    shutdownTimeout: 10,
    recipients: config.AUTH_USER,
    subject: 'Log green-shop',
    cc: config.ASSOCIATE_EMAIL
  });
