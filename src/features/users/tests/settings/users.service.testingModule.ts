import { Test } from "@nestjs/testing";
import { UsersModule, UsersServiceUseCases } from "../../users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtHandlerModule } from "src/auth/jwt/jwt.module";
import { EmailModule, EmailServiceUseCases } from "src/adapters/email/email.module";
import { EmailSendStatus, EmailServiceExecutionStatus } from "src/adapters/email/entities/email.service.entity";
import { MailerModule } from "@nestjs-modules/mailer";
import { TestUsersRepoTestingModule, testDbConfiguration } from "src/repo/users/tests/settings/users.repo.testingModule";
import { UsersRepoModule } from "src/repo/users/users.repo.module";
import { CqrsModule } from "@nestjs/cqrs";
import { DeviceRepoModule } from "src/repo/devices/devices.repo.module";
import { DeviceRepoService } from "src/repo/devices/devices.repo.service";
import { DevicesModule } from "src/features/devices/devices.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepoEntity } from "src/repo/users/entities/users.repo.entity";
import { DeviceRepoEntity } from "src/repo/devices/entities/devices.repo.entity";
import { forwardRef } from "@nestjs/common";

export const TestUsersServiceTestingModule = Test.createTestingModule({
    imports: [
        testDbConfiguration,
        UsersRepoModule,
        CqrsModule,
        JwtHandlerModule,
        EmailModule,
        DeviceRepoModule
    ],
    providers: [...UsersServiceUseCases]
})
