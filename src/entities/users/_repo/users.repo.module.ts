import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepoEntity } from "./_entities/users.repo.entity";
import { UsersRepoSaveUserUseCase } from "./_application/use-cases/users.repo.save.use-case";
import { UsersRepoService } from "./_application/users.repo.service";

const useCases = [
    UsersRepoSaveUserUseCase
]

@Module({
    imports:[TypeOrmModule.forFeature([UserRepoEntity])],
    providers:[UsersRepoService, ...useCases]
})
export class UsersRepoModule{}