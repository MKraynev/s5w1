import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepoEntity } from "./_entities/users.repo.entity";
import { UsersRepoCreateUserUseCase } from "./_application/use-cases/users.repo.create.usecase";
import { UsersRepoService } from "./_application/users.repo.service";
import { UsersRepoReadUserByPropertyValueUseCase } from "./_application/use-cases/users.repo.readByProperty.usecase";
import { UsersRepoClearUseCase } from "./_application/use-cases/users.repo.clear.usecase";

export const UsersRepoUseCases = [
    UsersRepoCreateUserUseCase,
    UsersRepoReadUserByPropertyValueUseCase,
    UsersRepoClearUseCase
]

@Module({
    imports:[TypeOrmModule.forFeature([UserRepoEntity])],
    providers:[UsersRepoService, ...UsersRepoUseCases],
    exports:[UsersRepoService, ...UsersRepoUseCases]
})
export class UsersRepoModule{}