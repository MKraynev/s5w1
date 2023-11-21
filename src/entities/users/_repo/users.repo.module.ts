import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepoEntity } from "./_entities/users.repo.entity";
import { UsersRepoCreateUserUseCase } from "./_application/use-cases/users.repo.create.usecase";
import { UsersRepoService } from "./_application/users.repo.service";
import { UsersRepoReadOneByPropertyValueUseCase } from "./_application/use-cases/users.repo.readOneByProperty.usecase";
import { UsersRepoClearUseCase } from "./_application/use-cases/users.repo.clear.usecase";
import { UsersRepoReadOneByFirstOrSecondPropertyUseCase } from "./_application/use-cases/users.repo.readOneByFirstOrSecondProperty.usecase";

export const UsersRepoUseCases = [
    UsersRepoCreateUserUseCase,
    UsersRepoReadOneByPropertyValueUseCase,
    UsersRepoClearUseCase,
    UsersRepoReadOneByFirstOrSecondPropertyUseCase
]

@Module({
    imports: [TypeOrmModule.forFeature([UserRepoEntity])],
    providers: [UsersRepoService, ...UsersRepoUseCases],
    exports: [UsersRepoService, ...UsersRepoUseCases]
})
export class UsersRepoModule { }