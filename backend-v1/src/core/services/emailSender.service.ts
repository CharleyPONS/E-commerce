import { Service } from '@tsed/common';
import { InternalServerError } from '@tsed/exceptions';
import * as fs from 'fs-extra';
import * as node_mailer from 'nodemailer';

import { UserEntity } from '../../api-rest/User/entities/user.entity';
import { UserRepository } from '../../api-rest/User/services/user.repository';
import { UserOrderedRepository } from '../../api-rest/UserOrdered/services/userOrdered.repository';
import { rootDir } from '../../Server';
import { MailProcess } from '../models/enum/mailProcess.enum';
import { IMailProcessInformationInterface } from '../models/interface/mailProcessInformation.interface';

import { WinstonLogger } from './winstonLogger';
// tslint:disable-next-line: no-var-requires
const hbs = require('nodemailer-express-handlebars');

@Service()
export class EmailSenderService {
  constructor(
    private _userRepository: UserRepository,
    private _userOrderedRepository: UserOrderedRepository
  ) {}
  async main(user: UserEntity, mailProcess: MailProcess): Promise<void> {
    const userData: any = await this._userRepository.findByEmail(user?.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userData?.email || !mailProcess || !emailRegex.test(userData?.email)) {
      return;
    }

    let mailProcessInformation: IMailProcessInformationInterface = {};
    if (mailProcess === MailProcess.NEW_CLIENT) {
      mailProcessInformation = {
        subject: 'A la vie, à la mort.',
        template: 'register',
        attachment: {
          isAttachment: false
        }
      };
    }
    if (mailProcess === MailProcess.VALIDATE_ORDER) {
      const userOrderedData = await this._userOrderedRepository.findByUserId(user.userId);
      mailProcessInformation = {
        subject: 'Vous êtes un champion.',
        template: 'validate-order',
        attachment: {
          isAttachment: true,
          path: rootDir + 'tmp/bill/',
          file: userOrderedData.billId + '.pdf'
        }
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
        extName: '.handlebars',
        partialsDir: rootDir + '/core/helpers/template/',
        layoutsDir: rootDir + '/core/helpers/template/',
        defaultLayout: `${mailProcessInformation?.template}`
      },
      viewPath: rootDir + '/core/helpers/template/',
      extName: '.handlebars'
    };

    defineTransporter.use('compile', hbs(handlebarOptions));

    let sendOptions;
    sendOptions = {
      from: `${process.env.AUTH_USER}` as string,
      to: `${userData?.email}`,
      subject: mailProcessInformation.subject,
      // @ts-ignore
      template: mailProcessInformation.template,
      context: {
        name: userData?.name || '',
        surname: userData?.surname || ''
      }
    };
    if (mailProcessInformation?.attachment?.isAttachment) {
      sendOptions = {
        ...sendOptions,
        attachments: [
          {
            filename: mailProcessInformation.attachment.file,
            path: mailProcessInformation.attachment.path
          }
        ]
      };
    }

    try {
      await defineTransporter.sendMail(sendOptions);
      if (mailProcessInformation?.attachment?.isAttachment) {
        await fs.unlink(
          `${mailProcessInformation?.attachment?.path}/${mailProcessInformation?.attachment?.file}`
        );
      }
      new WinstonLogger().logger().info(`send email to user done`, { user, mailProcess });
    } catch (err) {
      new WinstonLogger()
        .logger()
        .info(`error during send email to user`, { user, mailProcess, err });
      throw new InternalServerError('error during send email');
    }

    new WinstonLogger().logger().info(`email sent`, { user, mailProcess });
  }
}
