import { Test } from "@nestjs/testing";
import { testDbConfiguration } from "../../../repo/_tests/settings/users.repo.testingModule";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersRepoModule } from "../../../repo/users.repo.module";
import { UsersServiceUseCases } from "../../users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtGeneratorModule } from "src/jwt/jwt.module";
import { EmailModule, EmailServiceUseCases } from "src/adapters/email/email.module";
import { EmailServiceSendRegistrationMailCommand, EmailServiceSendRegistrationMailUseCase } from "src/adapters/email/email.service.sendRegistrationMail.usecase";
import { EmailSendStatus, EmailServiceExecutionStatus } from "src/adapters/email/entities/email.service.entity";
import { MailerModule } from "@nestjs-modules/mailer";

const EmailServiceMock = {
    execute: jest.fn(dto => {
        return { status: EmailSendStatus.Sent, error: undefined }
    })

}

export const TestUsersServiceTestingModule = Test.createTestingModule({
    imports: [
        testDbConfiguration,
        CqrsModule,
        UsersRepoModule,
        JwtModule,
        JwtGeneratorModule,
        EmailModule
    ],
    providers: [...UsersServiceUseCases]
})