import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserRepoEntity } from "../../_entities/users.repo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class UsersRepoReadOneByFirstOrSecondPropertyCommand {
    constructor(public message: {
        firstProperty: keyof UserRepoEntity,
        secondProperty: keyof UserRepoEntity,
        propertyValue: any
    }) { }
}

@Injectable()
@CommandHandler(UsersRepoReadOneByFirstOrSecondPropertyCommand)
export class UsersRepoReadOneByFirstOrSecondPropertyUseCase implements ICommandHandler<UsersRepoReadOneByFirstOrSecondPropertyCommand, UserRepoEntity>{

    constructor(
        @InjectRepository(UserRepoEntity)
        private userRepo: Repository<UserRepoEntity>
    ) { }

    async execute(command: UsersRepoReadOneByFirstOrSecondPropertyCommand): Promise<UserRepoEntity> {
        let firstFindPattern: any = {}
        firstFindPattern[command.message.firstProperty] = command.message.propertyValue;

        let secondFindPattern: any = {}
        secondFindPattern[command.message.secondProperty] = command.message.propertyValue;
        console.log(firstFindPattern, secondFindPattern);
        let foundUser = await this.userRepo.find(
            {
                where: [
                    firstFindPattern,
                    secondFindPattern
                ]
            })

        console.log("found users->", foundUser);

        return foundUser[0];
    }

}