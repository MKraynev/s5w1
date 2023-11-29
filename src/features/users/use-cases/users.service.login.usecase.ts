import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtHandlerService } from "src/auth/jwt/jwt.service";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";
import { DeviceRepoService } from "src/repo/devices/devices.repo.service";
import { UsersRepoService } from "src/repo/users/users.repo.service";

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
    constructor(public loginOrEmail: string, public password: string, public deviceInfo: RequestDeviceEntity) { }
}

@Injectable()
@CommandHandler(UsersServiceLoginCommand)
export class UsersServiceLoginUseCase implements ICommandHandler<UsersServiceLoginCommand, UserLoginDto>{

    constructor(private userRepo: UsersRepoService, private jwtHandler: JwtHandlerService, private deviceRepo: DeviceRepoService) { }

    async execute(command: UsersServiceLoginCommand): Promise<UserLoginDto> {
        let findUser = await this.userRepo.ReadOneFullyByLoginOrEmail(command.loginOrEmail);

        if (!findUser)
            return new UserLoginDto(UserLoginStatus.NotFound)

        if (!findUser.emailConfirmed)
            return new UserLoginDto(UserLoginStatus.UserNotConfirmed)

        if (!(await findUser.PasswordIsValid(command.password)))
            return new UserLoginDto(UserLoginStatus.WrongPassword)

        let userDevice = findUser.devices.find(device => device.name === command.deviceInfo.name);
        if(!userDevice){
            userDevice = await this.deviceRepo.Create(command.deviceInfo, findUser);
        }
        
        userDevice.refreshTime = new Date();

        await this.deviceRepo.UpdateOne(userDevice);

        let { accessTokenCode, refreshTokenCode } = await this.jwtHandler.GenerateUserLoginTokens(findUser.id, findUser.login, userDevice);

        return new UserLoginDto(UserLoginStatus.Success, accessTokenCode, refreshTokenCode)
    }
}