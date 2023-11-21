import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserCreateEntity } from "../../_entities/users.create.entity";
import { Users } from "../../_entities/users.repo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersRepoService } from "../users.repo.service";
import { Injectable } from "@nestjs/common";

export class UsersRepoCreateUserCommand {
    constructor(public message: UserCreateEntity) {}
}

@Injectable()
@CommandHandler(UsersRepoCreateUserCommand)
export class UsersRepoCreateUserUseCase implements ICommandHandler<UsersRepoCreateUserCommand, Users>{
    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>,
        private usersRepoService: UsersRepoService
    ) { }


    async execute(command: UsersRepoCreateUserCommand): Promise<Users> {
        let createUserDto = command.message;
        // let userDto = await this.usersRepoService.InitEntity(createUserDto);
        let userDto = await Users.InitEntity(createUserDto);
        let savedUser = await this.userRepo.save(userDto);

        return savedUser
    }
}