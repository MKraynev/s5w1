import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RequestDeviceMetaData } from "src/adapters/deviceMetaData/entities/request.deviceMetaData.entity";
import { JwtHandlerService } from "src/auth/jwt/jwt.service";
import { UsersRepoService } from "src/features/repo/users.repo.service";

export enum UserLoginStatus {
    Success,
    NotFound,
    WrongPassword,
    UserNotConfirmed
}

export class UserLoginDto {
    constructor(public status: UserLoginStatus, public accessToken?: string, public refreshToken?: string) { }
}




export class UsersServiceLoginCommand {
    constructor(public loginOrEmail: string, public password: string, public deviceInfo: RequestDeviceMetaData) { }
}

@Injectable()
@CommandHandler(UsersServiceLoginCommand)
export class UsersServiceLoginUseCase implements ICommandHandler<UsersServiceLoginCommand, UserLoginDto>{

    constructor(private userRepo: UsersRepoService, private jwtHandler: JwtHandlerService) { }

    async execute(command: UsersServiceLoginCommand): Promise<UserLoginDto> {
        let findUser = await this.userRepo.ReadOneByLoginOrEmail(command.loginOrEmail);

        if (!findUser)
            return new UserLoginDto(UserLoginStatus.NotFound)

        if (!findUser.emailConfirmed)
            return new UserLoginDto(UserLoginStatus.UserNotConfirmed)

        if (!findUser.PasswordIsValid(command.password))
            return new UserLoginDto(UserLoginStatus.WrongPassword)

        let { accessTokenCode, refreshTokenCode } = await this.jwtHandler.GenerateUserLoginTokens(findUser.id, findUser.login, command.deviceInfo);

        return new UserLoginDto(UserLoginStatus.Success, accessTokenCode, refreshTokenCode)
    }
}