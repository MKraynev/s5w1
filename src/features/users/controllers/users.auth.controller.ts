import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { UserControllerRegistrationEntity } from "./entities/users.controller.registration.entity";
import { CommandBus } from "@nestjs/cqrs";
import { RegistrationUserStatus, UsersServiceRegistrationCommand } from "../use-cases/users.service.registration.usecase";
import { ValidationPipe } from "src/common/pipes/validation.pipe";
import { UsersControllerRegistrationConfirmEntity } from "./entities/users.controller.registrationConfirm.entity";
import { ConfirmRegistrationUserStatus, UsersServiceConfirmRegistrationCommand } from "../use-cases/users.service.confirmRegistration.usecase";

@Throttle({ default: { limit: 5, ttl: 10000 } })
@Controller('auth')
export class UsersAuthController {

    constructor(private commandBus: CommandBus) { }

    //post -> /hometask_14/api/auth/password-recovery

    //post -> /hometask_14/api/auth/new-password

    //post -> /hometask_14/api/auth/login

    //post -> /hometask_14/api/auth/refresh-token

    //post -> /hometask_14/api/auth/registration-confirmation
    @Post('registration-confirmation')
    @HttpCode(HttpStatus.NO_CONTENT)
    async ConfrimEmail(@Body(new ValidationPipe()) codeDto: UsersControllerRegistrationConfirmEntity) {

        let confirmEmailStatus = await this.commandBus.execute<UsersServiceConfirmRegistrationCommand, ConfirmRegistrationUserStatus>(new UsersServiceConfirmRegistrationCommand(codeDto.code))

        switch (confirmEmailStatus) {
            case ConfirmRegistrationUserStatus.Success:
                return;
                break;

            default:
            case ConfirmRegistrationUserStatus.NotFound:
            case ConfirmRegistrationUserStatus.EmailAlreadyConfirmed:
                throw new BadRequestException({ errorsMessages: [{ message: "Wrong code", field: "code" }] })
                break;
        }
    }

    //post -> /hometask_14/api/auth/registration
    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async Registration(
        @Body(new ValidationPipe()) user: UserControllerRegistrationEntity
    ) {
        let saveUserStatus = await this.commandBus.execute<UsersServiceRegistrationCommand, RegistrationUserStatus>(new UsersServiceRegistrationCommand(user));

        switch (saveUserStatus) {
            case RegistrationUserStatus.Success:
                return;

            case RegistrationUserStatus.EmailAlreadyExist:
                throw new BadRequestException({ errorsMessages: [{ message: "Email already exist", field: "email" }] })
                break;

            default:
            case RegistrationUserStatus.LoginAlreadyExist:
                throw new BadRequestException({ errorsMessages: [{ message: "Login already exist", field: "login" }] })
                break;
        }
    }

    //post -> /hometask_14/api/auth/registration-email-resending

    //post -> /hometask_14/api/auth/logout

    //get -> /hometask_14/api/auth/me
}