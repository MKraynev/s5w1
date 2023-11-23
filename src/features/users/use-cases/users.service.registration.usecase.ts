import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserControllerRegistrationEntity } from "../controllers/entities/users.controller.registration.entity";
import { Injectable } from "@nestjs/common";
import { UsersRepoService } from "src/features/repo/users.repo.service";
import { EmailService } from "src/adapters/email/email.service";
import { _MAIN_ } from "src/main";
import { JwtHandlerService } from "src/auth/jwt/jwt.service";


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

    constructor(private usersRepo: UsersRepoService, private emailService: EmailService, private jwtHandler: JwtHandlerService) { }

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

        let registrationCode = await this.jwtHandler.GenerateUserRegistrationCode({ id: savedUser.id });
        //_MAIN_.ADDRES + 
        this.emailService.SendRegistrationMail(userInputData.email, registrationCode,  "/auth/registration-confirmation");

        return RegistrationUserStatus.Success;
    }

}