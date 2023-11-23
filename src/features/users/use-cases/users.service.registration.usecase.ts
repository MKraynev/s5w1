import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserControllerRegistrationEntity } from "../controllers/entities/users.controller.registration.entity";
import { Injectable } from "@nestjs/common";
import { UsersRepoReadManyByLoginByEmailCommand } from "../../repo/_application/use-cases/users.repo.readManyByLoginByEmail.usecase";
import { UserRepoEntity } from "../../repo/_entities/users.repo.entity";
import { UsersRepoCreateUserCommand } from "../../repo/_application/use-cases/users.repo.create.usecase";
import { EmailServiceSendRegistrationMailCommand, EmailServiceSendRegistrationMailUseCase } from "src/adapters/email/email.service.sendRegistrationMail.usecase";
import { EmailSendStatus, EmailServiceExecutionStatus } from "src/adapters/email/entities/email.service.entity";
import { CONFIRM_REGISTRATION_URL } from "src/settings";
import { JwtServiceGenerateRegistrationCodeCommand, JwtServiceGenerateRegistrationCodeUseCase } from "src/jwt/_application/use-cases/jwt.service.generate.registrationCode.usecase";
import { UsersRepoService } from "src/features/repo/users.repo.service";

export class UsersServiceRegistrationCommand {
    constructor(public command: UserControllerRegistrationEntity) { }
}

export enum RegistrationUserStatus {
    Success,
    EmailAlreadyExist,
    LoginAlreadyExist,
    ErrorEmailSending,
}

@Injectable()
@CommandHandler(UsersServiceRegistrationCommand)
export class UsersServiceRegistrationUseCase implements ICommandHandler<UsersServiceRegistrationCommand, RegistrationUserStatus>{

    constructor(private commandBus: CommandBus, private usersRepo: UsersRepoService) { }

    async execute(command: UsersServiceRegistrationCommand): Promise<RegistrationUserStatus> {
        let userInputData = command.command;

        // let findUsersByLoginByEmail = await this
        //     .commandBus
        //     .execute<UsersRepoReadManyByLoginByEmailCommand, UserRepoEntity[]>
        //     (new UsersRepoReadManyByLoginByEmailCommand(userInputData.login, userInputData.email))

        let findUsersByLoginByEmail = await this.usersRepo.ReadManyByLoginByEmail(userInputData.login, userInputData.email)

        if (findUsersByLoginByEmail.length) {
            let status = findUsersByLoginByEmail[0].login === userInputData.login ?
                RegistrationUserStatus.LoginAlreadyExist
                : RegistrationUserStatus.EmailAlreadyExist;

            return status;
        }

        // let savedUser = await this
        //     .commandBus
        //     .execute<UsersRepoCreateUserCommand, UserRepoEntity>
        //     (new UsersRepoCreateUserCommand(command.command))

        let savedUser = await this.usersRepo.Create(userInputData);

        let registrationCode = await this
            .commandBus
            .execute<JwtServiceGenerateRegistrationCodeCommand, string>
            (new JwtServiceGenerateRegistrationCodeCommand({ id: savedUser.id }))

        this.commandBus
            .execute<EmailServiceSendRegistrationMailCommand, EmailServiceExecutionStatus>
            (new EmailServiceSendRegistrationMailCommand(userInputData.email, registrationCode, CONFIRM_REGISTRATION_URL))



        return RegistrationUserStatus.Success;
    }

}