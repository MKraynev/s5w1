import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserCreateEntity } from "../../_repo/_entities/users.create.entity";
import { Injectable } from "@nestjs/common";
import { UsersRepoReadManyByLoginByEmailCommand } from "../../_repo/_application/use-cases/users.repo.readManyByLoginByEmail.usecase";
import { UserRepoEntity } from "../../_repo/_entities/users.repo.entity";
import { UsersRepoCreateUserCommand } from "../../_repo/_application/use-cases/users.repo.create.usecase";

export class UsersServiceRegistrationCommand {
    constructor(public command: UserCreateEntity) { }
}

export enum RegistrationUserStatus {
    Success,
    EmailAlreadyExist,
    LoginAlreadyExist,
    WrongInputData
}

@Injectable()
@CommandHandler(UsersServiceRegistrationCommand)
export class UsersServiceRegistrationUseCase implements ICommandHandler<UsersServiceRegistrationCommand, RegistrationUserStatus>{

    constructor(private commandBus: CommandBus) { }

    async execute(command: UsersServiceRegistrationCommand): Promise<RegistrationUserStatus> {

        let findUsersByLoginByEmail = await this.commandBus.execute<UsersRepoReadManyByLoginByEmailCommand, UserRepoEntity[]>(new UsersRepoReadManyByLoginByEmailCommand(command.command.login, command.command.email))

        if (findUsersByLoginByEmail.length) {
            return findUsersByLoginByEmail[0].login === command.command.login ?
                RegistrationUserStatus.LoginAlreadyExist
                : RegistrationUserStatus.EmailAlreadyExist;
        }

        let savedUser = await this.commandBus.execute<UsersRepoCreateUserCommand, UserRepoEntity>(new UsersRepoCreateUserCommand(command.command))

        return RegistrationUserStatus.Success;
    }

}