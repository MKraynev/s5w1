import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Users } from "../../_entities/users.repo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class UsersRepoReadOneByLoginOrEmailCommand {
    constructor(public message: {
        firstProperty: keyof Users,
        secondProperty: keyof Users,
        propertyValue: any
    }) { }
}

@Injectable()
@CommandHandler(UsersRepoReadOneByLoginOrEmailCommand)
export class UsersRepoReadOneByLoginOrEmailUseCase implements ICommandHandler<UsersRepoReadOneByLoginOrEmailCommand, Users>{

    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>
    ) { }

    async execute(command: UsersRepoReadOneByLoginOrEmailCommand): Promise<Users> {

        let founduser = await this.userRepo.findOne({
            where: [
                { login: command.message.propertyValue },
                { email: command.message.propertyValue }
            ]
        }
        )

        return founduser;
    }
}