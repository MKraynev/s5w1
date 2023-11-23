import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserControllerRegistrationEntity } from "../controllers/entities/users.controller.registration.entity";
import { Injectable } from "@nestjs/common";
import { JwtServiceGenerateRegistrationCodeCommand } from "src/jwt/_application/use-cases/jwt.service.generate.registrationCode.usecase";
import { UsersRepoService } from "src/features/repo/users.repo.service";
import { EmailService } from "src/adapters/email/email.service";
import { CONFIRM_REGISTRATION_URL } from "src/settings";

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

    constructor(private commandBus: CommandBus, private usersRepo: UsersRepoService, private emailService: EmailService) { }

    async execute(command: UsersServiceRegistrationCommand): Promise<RegistrationUserStatus> {
        let userInputData = command.command;

        let findUsersByLoginByEmail = await this.usersRepo.ReadManyByLoginByEmail(userInputData.login, userInputData.email)

        if (findUsersByLoginByEmail.length) {
            let status = findUsersByLoginByEmail[0].login === userInputData.login ?
                RegistrationUserStatus.LoginAlreadyExist
                : RegistrationUserStatus.EmailAlreadyExist;

            return status;
        }

        let savedUser = await this.usersRepo.Create(userInputData);

        let registrationCode = await this
            .commandBus
            .execute<JwtServiceGenerateRegistrationCodeCommand, string>
            (new JwtServiceGenerateRegistrationCodeCommand({ id: savedUser.id }))

        // this.commandBus
        //     .execute<EmailServiceSendRegistrationMailCommand, EmailServiceExecutionStatus>
        //     (new EmailServiceSendRegistrationMailCommand(userInputData.email, registrationCode, CONFIRM_REGISTRATION_URL))

        this.emailService.SendRegistrationMail(userInputData.email, registrationCode, CONFIRM_REGISTRATION_URL);

        return RegistrationUserStatus.Success;
    }

}