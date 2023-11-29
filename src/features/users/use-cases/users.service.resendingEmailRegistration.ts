import { Injectable } from "@nestjs/common";
import { UsersControllerResending } from "../controllers/entities/users.controller.resending";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepoService } from "src/repo/users/users.repo.service";
import { EmailService } from "src/adapters/email/email.service";
import { JwtHandlerService } from "src/auth/jwt/jwt.service";
import { _MAIN_ } from "src/main";

export class UsersServiceResendingRegistrationCommand {
    constructor(public command: UsersControllerResending) { }
}

export enum ResendingRegistrationStatus {
    Success,
    UserNotFound,
    EmailAlreadyConfirmed
}

@Injectable()
@CommandHandler(UsersServiceResendingRegistrationCommand)
export class UsersServiceResendingRegistrationUseCase implements ICommandHandler<UsersServiceResendingRegistrationCommand, ResendingRegistrationStatus>{

    constructor(private usersRepo: UsersRepoService, private emailService: EmailService, private jwtHandler: JwtHandlerService) { }

    async execute(command: UsersServiceResendingRegistrationCommand): Promise<ResendingRegistrationStatus> {

        let founduser = await this.usersRepo.ReadOneFullyByLoginOrEmail(command.command.email);

        if (!founduser)
            return ResendingRegistrationStatus.UserNotFound;

        if (founduser.emailConfirmed)
            return ResendingRegistrationStatus.EmailAlreadyConfirmed;


        let registrationCode = await this.jwtHandler.GenerateUserRegistrationCode({ id: founduser.id.toString() });
        //_MAIN_.ADDRES + 
        this.emailService.SendRegistrationMail(founduser.email, registrationCode, _MAIN_.ADDRES + "/auth/registration-confirmation");

        return ResendingRegistrationStatus.Success;
    }

}