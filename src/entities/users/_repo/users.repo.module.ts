import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./_entities/users.repo.entity";
import { UsersRepoCreateUserUseCase } from "./_application/use-cases/users.repo.create.usecase";
import { UsersRepoService } from "./_application/users.repo.service";
import { UsersRepoReadOneByPropertyValueUseCase } from "./_application/use-cases/users.repo.readOneByProperty.usecase";
import { UsersRepoClearUseCase } from "./_application/use-cases/users.repo.clear.usecase";
import { UsersRepoReadOneByLoginOrEmailUseCase } from "./_application/use-cases/users.repo.readOneByLoginOrEmail.usecase";

export const UsersRepoUseCases = [
    UsersRepoCreateUserUseCase,
    UsersRepoReadOneByPropertyValueUseCase,
    UsersRepoClearUseCase,
    UsersRepoReadOneByLoginOrEmailUseCase
]

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [UsersRepoService, ...UsersRepoUseCases],
    exports: [UsersRepoService, ...UsersRepoUseCases]
})
export class UsersRepoModule { }