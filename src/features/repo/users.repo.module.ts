import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepoEntity } from "./entities/users.repo.entity";
import { UsersRepoCreateUserUseCase } from "./application/use-cases/users.repo.create.usecase";
import { UsersRepoService } from "./users.repo.service";
import { UsersRepoReadOneByPropertyValueUseCase } from "./application/use-cases/users.repo.readOneByProperty.usecase";
import { UsersRepoClearUseCase } from "./application/use-cases/users.repo.clear.usecase";
import { UsersRepoReadOneByLoginOrEmailUseCase } from "./application/use-cases/users.repo.readOneByLoginOrEmail.usecase";
import { UsersRepoReadManyByLoginByEmailUseCase } from "./application/use-cases/users.repo.readManyByLoginByEmail.usecase";
import { UsersRepoUpdateOneUseCase } from "./application/use-cases/users.repo.update.usecase";

export const UsersRepoUseCases = [
    UsersRepoCreateUserUseCase,
    UsersRepoReadOneByPropertyValueUseCase,
    UsersRepoClearUseCase,
    UsersRepoReadOneByLoginOrEmailUseCase,
    UsersRepoReadManyByLoginByEmailUseCase,
    UsersRepoUpdateOneUseCase
]

@Module({
    imports: [TypeOrmModule.forFeature([UserRepoEntity])],
    providers: [UsersRepoService, ...UsersRepoUseCases],
    exports: [UsersRepoService, ...UsersRepoUseCases]
})
export class UsersRepoModule { }