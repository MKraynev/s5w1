import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepoEntity } from "./_entities/users.repo.entity";

@Module({
    imports:[TypeOrmModule.forFeature([UserRepoEntity])],
    providers:[]
})
export class UsersRepoModule{}