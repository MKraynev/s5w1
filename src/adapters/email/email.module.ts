import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MAIL_LOGIN, MAIL_PASSWORD } from "src/settings";
import { EmailServiceSendRegistrationMailUseCase } from "./email.service.sendRegistrationMail.usecase";

export const EmailServiceUseCases = [
    EmailServiceSendRegistrationMailUseCase
]


@Module({
    imports: [MailerModule.forRoot({
        transport: {
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: MAIL_LOGIN,
                pass: MAIL_PASSWORD
            }
        }
    })],
    providers: [...EmailServiceUseCases],
    exports: [...EmailServiceUseCases]
})
export class EmailModule { }