import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../../_entities/users.repo.entity";
import { Repository } from "typeorm";

export class UsersRepoClearCommand {

}

@Injectable()
@CommandHandler(UsersRepoClearCommand)
export class UsersRepoClearUseCase implements ICommandHandler<UsersRepoClearCommand, number>{

    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>
    ) { }

    async execute(command: UsersRepoClearCommand): Promise<number> {
        let deleteAll = await this.userRepo.delete({});

        return deleteAll.affected;
    }
}