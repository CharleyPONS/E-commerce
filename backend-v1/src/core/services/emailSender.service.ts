import { Service } from '@tsed/common';
import { InternalServerError } from '@tsed/exceptions';
import { hashSync } from 'bcrypt';
import * as fs from 'fs-extra';
import * as node_mailer from 'nodemailer';

import { UserEntity } from '../../api-rest/User/entities/user.entity';
import { UserRepository } from '../../api-rest/User/services/user.repository';
import { UserOrderedRepository } from '../../api-rest/UserOrdered/services/userOrdered.repository';
import { rootDir } from '../../Server';
import { config } from '../config';
import { MailProcess } from '../models/enum/mailProcess.enum';
import { IMailProcessInformationInterface } from '../models/interface/mailProcessInformation.interface';

import { $logger } from './customLogger';
// tslint:disable-next-line: no-var-requires
const hbs = require('nodemailer-express-handlebars');

@Service()
export class EmailSenderService {
  constructor(
    private _userRepository: UserRepository,
    private _userOrderedRepository: UserOrderedRepository
  ) {}
  async main(user: UserEntity, mailProcess: MailProcess, userOrderedId?: string): Promise<void> {
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
    let userOrderedData;
    if (mailProcess === MailProcess.VALIDATE_ORDER && userOrderedId) {
      userOrderedData = await this._userOrderedRepository.findByUserIdAndUserOrderedId(
        user.userId,
        userOrderedId as string
      );
      mailProcessInformation = {
        subject: 'Vous êtes un champion.',
        template: 'validate-order',
        attachment: {
          isAttachment: true,
          path: rootDir + '/tmp/bill/' + userOrderedData.billId.toString() + '.pdf',
          file: 'Facture numéro ' + userOrderedData.billId.toString()
        }
      };
    }
    // @ts-ignore
    if (mailProcess === MailProcess.RESET_PASSWORD) {
      mailProcessInformation = {
        subject: 'Magie magie.',
        template: 'reset',
        attachment: {
          isAttachment: false
        }
      };
    }

    const defineTransporter = node_mailer.createTransport({
      host: config.HOST_SMTP,
      secure: false,
      auth: {
        user: config.AUTH_USER,
        pass: config.AUTH_PASSWORD
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
      from: `${config.AUTH_USER}` as string,
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
    if (mailProcess === MailProcess.RESET_PASSWORD) {
      const newPassword = Math.random().toString(36).slice(2);
      sendOptions = {
        ...sendOptions,
        // @ts-ignore
        context: {
          ...sendOptions.context,
          password: newPassword
        }
      };
      await this._userRepository.updateOne(
        { id: user.id },
        { password: hashSync(newPassword, 10) },
        user
      );
    }

    try {
      await defineTransporter.sendMail(sendOptions);
      if (userOrderedData && fs.existsSync(rootDir + `/tmp/bill/${userOrderedData.billId}.pdf`)) {
        fs.unlinkSync(rootDir + `/tmp/bill/${userOrderedData.billId}.pdf`);
      }
      $logger.info(`send email to user done`, { user, mailProcess });
    } catch (err) {
      $logger.error(`error during send email to user`, { user, mailProcess, err });
      throw new InternalServerError('error during send email');
    }

    $logger.info(`email sent`, { user, mailProcess });
  }
}
