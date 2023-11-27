import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { EmailSendStatus, EmailServiceExecutionStatus, MailServiceEntity } from "./entities/email.service.entity";
import { MAIL_LOGIN } from "src/settings";

@Injectable()
export class EmailService {

    constructor(private mailerService: MailerService) { }

    public async SendRegistrationMail(sendTo: string, confirmCode: string, confirmRegistrationUrl: string) {
        let result: EmailServiceExecutionStatus = { status: EmailSendStatus.Sent, error: undefined };

        let sendMail = await this.mailerService
            .sendMail(this._CONFIRM_EMAIL_FORM(sendTo, confirmCode, confirmRegistrationUrl))
            .catch(err => {
                result.status = EmailSendStatus.NotDelivered,
                    result.error = err;
                
                    console.log(result)
            })

        return result;
    }

    private _CONFIRM_EMAIL_FORM(sendTo: string, confirmCode: string, registrationPath: string): MailServiceEntity {
        let result: MailServiceEntity = {
            to: sendTo,
            from: `"SAMURAI 🥷"<${MAIL_LOGIN}@gmail.com>`,
            subject: "Confirm email",
            text: "",
            html: `
            <p>To finish registration please follow the link below:
            <a href='${registrationPath}?code=${confirmCode}'>complete registration</a>
            </p>`
        }

        return result;
    }
}