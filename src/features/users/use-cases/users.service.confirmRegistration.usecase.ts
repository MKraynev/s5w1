import { Injectable } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtHandlerService } from "src/auth/jwt/jwt.service";
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

    constructor(private usersRepo: UsersRepoService, private jwtHandler: JwtHandlerService) { }

    async execute(command: UsersServiceConfirmRegistrationCommand): Promise<ConfirmRegistrationUserStatus> {
        let decodeConfirmCode = await this.jwtHandler.ReadUserRegistrationCode(command.confrimCode)

        let findUser = await this.usersRepo.ReadOneByPropertyValue("id", decodeConfirmCode.id)

        if (!findUser)
            return ConfirmRegistrationUserStatus.NotFound;

        if (findUser.emailConfirmed)
            return ConfirmRegistrationUserStatus.EmailAlreadyConfirmed;

        findUser.emailConfirmed = true;

        let updateUser = await this.usersRepo.UpdateOne(findUser);

        return ConfirmRegistrationUserStatus.Success;
    }
}