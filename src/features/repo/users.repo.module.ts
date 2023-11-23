import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepoEntity } from "./_entities/users.repo.entity";
import { UsersRepoCreateUserUseCase } from "./_application/use-cases/users.repo.create.usecase";
import { UsersRepoService } from "./_application/users.repo.service";
import { UsersRepoReadOneByPropertyValueUseCase } from "./_application/use-cases/users.repo.readOneByProperty.usecase";
import { UsersRepoClearUseCase } from "./_application/use-cases/users.repo.clear.usecase";
import { UsersRepoReadOneByLoginOrEmailUseCase } from "./_application/use-cases/users.repo.readOneByLoginOrEmail.usecase";
import { UsersRepoReadManyByLoginByEmailUseCase } from "./_application/use-cases/users.repo.readManyByLoginByEmail.usecase";
import { UsersRepoUpdateOneUseCase } from "./_application/use-cases/users.repo.update.usecase";

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