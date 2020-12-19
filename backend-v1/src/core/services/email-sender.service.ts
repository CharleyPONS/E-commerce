import {Service} from "@tsed/common";
import {MailProcess} from "../models/enum/mail-process.enum";
import * as node_mailer from 'nodemailer';
import {MailProcessInformationInterface} from "../models/interface/mailProcessInformation.interface";
import {User} from "../../api-rest/User/models/user";
import {UserCRUDService} from "../../api-rest/User/services/userCRUD.service";
import {WinstonLogger} from "../winston-logger";
import {InternalServerError} from "@tsed/exceptions";
import exphbs = require("express-handlebars");

@Service()
export class EmailSenderService {
    constructor(private _userCRUD: UserCRUDService) {}
    async main(user: User, mailProcess: MailProcess): Promise<void>{
        const userData: any = this._userCRUD.findByEmail(user?.email);
        if(!userData?.email || !process || !userData?.email.match('\t^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')){
            return;
        }

        let mailProcessInformation: MailProcessInformationInterface = {};
        if(mailProcess === MailProcess.NEW_CLIENT){
            mailProcessInformation = {
                subject: 'A la vie, à la mort.',
                template: 'validate-order.template'
            }
        }

        const defineTransporter = node_mailer.createTransport({
            host: process.env.HOST_SMTP,
            secure: false,
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASSWORD
            },
            debug: true,
        });

        defineTransporter.use('compile', exphbs({
            layoutsDir: '../helpers/template'
        }));

        const sendOptions = {
            from: `Greg" ${process.env.AUTH_USER}`,
            to: `${userData?.email}`,
            subject: mailProcessInformation.subject,
            template: mailProcessInformation.template,
            context: {
                name: userData?.name,
                surname: userData?.surname
            },
            attachments: [
                {filename: '', path: ''}
            ]
        };

        await defineTransporter.sendMail(sendOptions, (err) => {
            if(err){
                new WinstonLogger().logger().info(`error during send email to user`, {user, mailProcess});
                throw new InternalServerError('error during send email');
            }
            });
        new WinstonLogger().logger().info(`email sent`, {user, mailProcess});
    }
}
