import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface SendMail {
    to: string[]
    subject: string
    html: string
    cc?: string[]
}


@Injectable()
export class SendmailService {
    constructor(
        private readonly mailerService: MailerService,
        private configService: ConfigService
    ) { }

    public async sendMail(mailData: SendMail): Promise<string | void> {
        try {
            const msgId = await this.mailerService.sendMail({
                to: mailData.to,
                from: this.configService.get('SMTP_USER'), // sender address
                subject: mailData.subject, // Subject line
                html: mailData.html, // HTML body content
            });
            console.log("Mail Sent to ", mailData.to);
            return msgId.messageId;
        } catch (error) {
            console.log(error);

            return Promise.reject(error.message)
        }
    }
}