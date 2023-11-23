import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserControllerRegistrationEntity } from "../../../users/controllers/entities/users.controller.registration.entity";
import { UserRepoEntity } from "../../_entities/users.repo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersRepoService } from "../../users.repo.service";
import { Injectable } from "@nestjs/common";

export class UsersRepoCreateUserCommand {
    constructor(public message: UserControllerRegistrationEntity) { }
}

@Injectable()
@CommandHandler(UsersRepoCreateUserCommand)
export class UsersRepoCreateUserUseCase implements ICommandHandler<UsersRepoCreateUserCommand, UserRepoEntity>{
    constructor(
        @InjectRepository(UserRepoEntity)
        private userRepo: Repository<UserRepoEntity>
    ) { }


    async execute(command: UsersRepoCreateUserCommand): Promise<UserRepoEntity> {
        let createUserDto = command.message;

        let userDto = await UserRepoEntity.Init(createUserDto);
        let savedUser = await this.userRepo.save(userDto);

        return savedUser
    }
}