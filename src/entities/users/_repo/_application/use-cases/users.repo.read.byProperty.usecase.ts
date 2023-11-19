import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserRepoEntity } from "../../_entities/users.repo.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

export class UsersRepoReadUserByPropertyValueCommand {
    constructor(public message: { propertyName: keyof UserRepoEntity, propertyValue: any }) { }
}

@Injectable()
@CommandHandler(UsersRepoReadUserByPropertyValueCommand)
export class UsersRepoReadUserByPropertyValueUseCase implements ICommandHandler<UsersRepoReadUserByPropertyValueCommand, UserRepoEntity>{

    constructor(
        @InjectRepository(UserRepoEntity)
        private userRepo: Repository<UserRepoEntity>) { }

    async execute(command: UsersRepoReadUserByPropertyValueCommand): Promise<UserRepoEntity | null> {
        let findObj: FindOptionsWhere<UserRepoEntity> = {};
        findObj[command.message.propertyName] = command.message.propertyValue;
        return await this.userRepo.findOneBy(findObj)
    }
}