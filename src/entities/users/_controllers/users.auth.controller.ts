import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { UserCreateEntity } from "../_repo/_entities/users.create.entity";
import { CommandBus } from "@nestjs/cqrs";
import { RegistrationUserStatus, UsersServiceRegistrationCommand } from "../_application/use-cases/users.service.registration.usecase";
import { ValidationPipe } from "src/entities/validation/validation.pipe";

@Throttle({ default: { limit: 5, ttl: 10000 } })
@Controller('auth')
export class UsersAuthController {

    constructor(private commandBus: CommandBus) { }

    //post -> /hometask_14/api/auth/registration
    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async Registration(
        @Body(new ValidationPipe()) user: UserCreateEntity
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
}