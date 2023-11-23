import { Test } from "@nestjs/testing";
import { UsersServiceUseCases } from "../../users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtHandlerModule } from "src/auth/jwt/jwt.module";
import { EmailModule, EmailServiceUseCases } from "src/adapters/email/email.module";
import { EmailSendStatus, EmailServiceExecutionStatus } from "src/adapters/email/entities/email.service.entity";
import { MailerModule } from "@nestjs-modules/mailer";
import { testDbConfiguration } from "src/repo/users/tests/settings/users.repo.testingModule";
import { UsersRepoModule } from "src/repo/users/users.repo.module";
import { CqrsModule } from "@nestjs/cqrs";

const EmailServiceMock = {
    execute: jest.fn(dto => {
        return { status: EmailSendStatus.Sent, error: undefined }
    })

}

export const TestUsersServiceTestingModule = Test.createTestingModule({
    imports: [
        testDbConfiguration,
        UsersRepoModule,
        CqrsModule,
        JwtHandlerModule,
        EmailModule
    ],
    providers: [...UsersServiceUseCases]
})