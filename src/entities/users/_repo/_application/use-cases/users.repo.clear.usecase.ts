import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepoEntity } from "../../_entities/users.repo.entity";
import { Repository } from "typeorm";

export class UsersRepoClearCommand {

}

@Injectable()
@CommandHandler(UsersRepoClearCommand)
export class UsersRepoClearUseCase implements ICommandHandler<UsersRepoClearCommand, boolean>{

    constructor(
        @InjectRepository(UserRepoEntity)
        private userRepo: Repository<UserRepoEntity>
    ) { }

    async execute(command: UsersRepoClearCommand): Promise<boolean> {
        let deleteAll = await this.userRepo.delete({});
        
        console.log(deleteAll);

        return true;
    }
}