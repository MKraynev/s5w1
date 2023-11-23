import { Injectable } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtServiceReadRegistrationCodeCommand } from "src/jwt/_application/use-cases/jwt.service.read.registrationCode.usecase";
import { UserRegistrationLoad } from "src/jwt/_application/use-cases/jwt.service.generate.registrationCode.usecase";
import { UsersRepoService } from "src/features/repo/users.repo.service";

export enum ConfirmRegistrationUserStatus {
    Success,
    NotFound,
    EmailAlreadyConfirmed
}

export class UsersServiceConfirmRegistrationCommand {

    constructor(public confrimCode: string) { }
}

@Injectable()
@CommandHandler(UsersServiceConfirmRegistrationCommand)
export class UsersServiceConfirmRegistrationUseCase implements ICommandHandler<UsersServiceConfirmRegistrationCommand, ConfirmRegistrationUserStatus>{

    constructor(private commandBus: CommandBus, private usersRepo: UsersRepoService) { }

    async execute(command: UsersServiceConfirmRegistrationCommand): Promise<ConfirmRegistrationUserStatus> {
        let decodeConfirmCode = await this.commandBus.execute<JwtServiceReadRegistrationCodeCommand, UserRegistrationLoad>(new JwtServiceReadRegistrationCodeCommand(command.confrimCode));

        // let findUser = await this.commandBus.execute<UsersRepoReadOneByPropertyValueCommand, UserRepoEntity>(new UsersRepoReadOneByPropertyValueCommand({ propertyName: "id", propertyValue: decodeConfirmCode.id }));
        let findUser = await this.usersRepo.ReadOneByPropertyValue("id", decodeConfirmCode.id)

        if (!findUser)
            return ConfirmRegistrationUserStatus.NotFound;

        if (findUser.emailConfirmed)
            return ConfirmRegistrationUserStatus.EmailAlreadyConfirmed;

        findUser.emailConfirmed = true;
        // let updateUser = await this.commandBus.execute<UsersRepoUpdateOneCommand, UserRepoEntity>(new UsersRepoUpdateOneCommand(findUser));
        let updateUser = await this.usersRepo.UpdateOne(findUser);

        return ConfirmRegistrationUserStatus.Success;
    }
}