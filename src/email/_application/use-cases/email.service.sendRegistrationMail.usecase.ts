import { MailerService, ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EmailSendStatus, EmailServiceExecutionStatus, MailServiceEntity } from "src/email/_entities/email.service.entity";
import { MAIL_LOGIN } from "src/settings";

export class EmailServiceSendRegistrationMailCommand {

    constructor(
        public sendTo: string,
        public confirmCode: string,
        public confirmRegistrationUrl: string) { }
}



@Injectable()
@CommandHandler(EmailServiceSendRegistrationMailCommand)
export class EmailServiceSendRegistrationMailUseCase implements ICommandHandler<EmailServiceSendRegistrationMailCommand, EmailServiceExecutionStatus>{

    constructor(private mailerService: MailerService) { }

    async execute(command: EmailServiceSendRegistrationMailCommand): Promise<EmailServiceExecutionStatus> {
        let result: EmailServiceExecutionStatus = { status: EmailSendStatus.Sent, error: undefined };

        let sendMail = await this.mailerService
            .sendMail(this._CONFIRM_EMAIL_FORM(command.sendTo, command.confirmCode, command.confirmRegistrationUrl))
            .catch(err => {
                result.status = EmailSendStatus.NotDelivered,
                    result.error = err;
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