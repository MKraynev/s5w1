import { Test } from "@nestjs/testing";
import { testDbConfiguration } from "../../_repo/_tests/settings/users.repo.testingModule";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepoEntity } from "../../_repo/_entities/users.repo.entity";
import { UsersRepoModule, UsersRepoUseCases } from "../../_repo/users.repo.module";
import { UsersModule, UsersServiceUseCases } from "../../users.module";

export const TestUsersServiceTestingModule = Test.createTestingModule({
    imports: [
        testDbConfiguration,
        CqrsModule,
        UsersRepoModule
    ],
    providers: [...UsersServiceUseCases]
})