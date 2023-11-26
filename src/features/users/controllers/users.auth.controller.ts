import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Res, UnauthorizedException } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { UserControllerRegistrationEntity } from "./entities/users.controller.registration.entity";
import { CommandBus } from "@nestjs/cqrs";
import { Response } from "express";
import { RegistrationUserStatus, UsersServiceRegistrationCommand } from "../use-cases/users.service.registration.usecase";
import { ValidateParameters } from "src/common/pipes/validation.pipe";
import { UsersControllerRegistrationConfirmEntity } from "./entities/users.controller.registrationConfirm.entity";
import { ConfirmRegistrationUserStatus, UsersServiceConfirmRegistrationCommand } from "../use-cases/users.service.confirmRegistration.usecase";
import { UserLoginEntity } from "./entities/users.controller.login.entity";
import { ReadRequestDeviceMetaData } from "src/adapters/deviceMetaData/request.device";
import { RequestDeviceMetaData } from "src/adapters/deviceMetaData/entities/request.deviceMetaData.entity";
import { UserLoginDto, UserLoginStatus, UsersServiceLoginCommand } from "../use-cases/users.service.login.usecase";

@Throttle({ default: { limit: 5, ttl: 10000 } })
@Controller('auth')
export class UsersAuthController {

    constructor(private commandBus: CommandBus) { }

    //post -> /hometask_14/api/auth/password-recovery

    //post -> /hometask_14/api/auth/new-password

    //post -> /hometask_14/api/auth/login
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async Login(
        @Body(new ValidateParameters()) userDto: UserLoginEntity,
        @Res({ passthrough: true }) response: Response,
        @ReadRequestDeviceMetaData() device: RequestDeviceMetaData
    ) {
        let login = await this.commandBus.execute<UsersServiceLoginCommand, UserLoginDto>(new UsersServiceLoginCommand(userDto.loginOrEmail, userDto.password, device))

        switch (login.status) {
            case UserLoginStatus.Success:
                response.cookie("refreshToken", login.refreshToken, { httpOnly: true, secure: true })
                response.status(200).send({ accessToken: login.accessToken })
                break;

            default:
            case UserLoginStatus.NotFound:
            case UserLoginStatus.WrongPassword:
                throw new UnauthorizedException();
                break;
        }
    }

    //post -> /hometask_14/api/auth/refresh-token

    //post -> /hometask_14/api/auth/registration-confirmation
    @Post('registration-confirmation')
    @HttpCode(HttpStatus.NO_CONTENT)
    async ConfrimEmail(@Body(new ValidateParameters()) codeDto: UsersControllerRegistrationConfirmEntity) {

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
        @Body(new ValidateParameters()) user: UserControllerRegistrationEntity
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