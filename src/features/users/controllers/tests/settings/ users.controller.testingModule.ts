import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/features/users/users.module";
import { UserRepoEntity } from "src/repo/users/entities/users.repo.entity";
import { testDbConfiguration } from "src/repo/users/tests/settings/users.repo.testingModule";
import { UsersRepoService } from "src/repo/users/users.repo.service";
import { UsersController } from "../../users.controller";

export const TestUsersServiceTestingModule = Test.createTestingModule({
    imports: [
        testDbConfiguration,
        TypeOrmModule.forFeature([UserRepoEntity])],
    controllers: [UsersController],
    providers: [UsersRepoService]
})