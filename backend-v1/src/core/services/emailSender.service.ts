import { Service } from '@tsed/common';
import { InternalServerError } from '@tsed/exceptions';
import * as node_mailer from 'nodemailer';

import { UserEntity } from '../../api-rest/User/entities/user.entity';
import { UserRepository } from '../../api-rest/User/services/user.repository';
import { MailProcess } from '../models/enum/mailProcess.enum';
import { IMailProcessInformationInterface } from '../models/interface/mailProcessInformation.interface';

import { WinstonLogger } from './winstonLogger';
import { rootDir } from '../../Server';
// tslint:disable-next-line: no-var-requires
const hbs = require('nodemailer-express-handlebars');

@Service()
export class EmailSenderService {
  constructor(private _userCRUD: UserRepository) {}
  async main(user: UserEntity, mailProcess: MailProcess): Promise<void> {
    const userData: any = await this._userCRUD.findByEmail(user?.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userData?.email || !mailProcess || !emailRegex.test(userData?.email)) {
      return;
    }

    let mailProcessInformation: IMailProcessInformationInterface = {};
    if (mailProcess === MailProcess.NEW_CLIENT) {
      mailProcessInformation = {
        subject: 'A la vie, à la mort.',
        template: 'validate-order.template'
      };
    }

    const defineTransporter = node_mailer.createTransport({
      host: process.env.HOST_SMTP,
      secure: false,
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD
      },
      debug: true
    });
    const handlebarOptions = {
      viewEngine: {
        extName: '.hbs',
        partialsDir: rootDir + '/core/helpers/template/',
        layoutsDir: rootDir + '/core/helpers/template/',
        defaultLayout: 'email.body.hbs'
      },
      viewPath: rootDir + '/core/helpers/template/',
      extName: '.hbs'
    };

    defineTransporter.use('compile', hbs(handlebarOptions));

    const sendOptions = {
      from: `${process.env.AUTH_USER}` as string,
      to: `${userData?.email}`,
      subject: mailProcessInformation.subject,
      template: mailProcessInformation.template,
      context: {
        name: userData?.name || '',
        surname: userData?.surname || ''
      },
      attachments: [{ filename: '', path: '' }]
    };
    try {
      await defineTransporter.sendMail(sendOptions);
    } catch (err) {
      new WinstonLogger()
        .logger()
        .info(`error during send email to user`, { user, mailProcess, err });
      throw new InternalServerError('error during send email');
    }

    new WinstonLogger().logger().info(`email sent`, { user, mailProcess });
  }
}
