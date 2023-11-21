import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Users } from "../../_entities/users.repo.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

export class UsersRepoReadOneByPropertyValueCommand {
    constructor(public message: { propertyName: keyof Users, propertyValue: any }) { }
}

@Injectable()
@CommandHandler(UsersRepoReadOneByPropertyValueCommand)
export class UsersRepoReadOneByPropertyValueUseCase implements ICommandHandler<UsersRepoReadOneByPropertyValueCommand, Users>{

    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>) { }

    async execute(command: UsersRepoReadOneByPropertyValueCommand): Promise<Users | null> {
        let findObj: FindOptionsWhere<Users> = {};
        findObj[command.message.propertyName] = command.message.propertyValue;
        return await this.userRepo.findOneBy(findObj)
    }
}