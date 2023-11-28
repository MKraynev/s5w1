import { Injectable } from "@nestjs/common";
import { UsersControllerRegistrationConfirmEntity } from "../controllers/entities/users.controller.registrationConfirm.entity";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepoService } from "src/repo/users/users.repo.service";
import { JwtHandlerService } from "src/auth/jwt/jwt.service";
import { JwtServiceUserRefreshTokenLoad } from "src/auth/jwt/entities/jwt.service.refreshTokenLoad";
import { DeviceRepoService } from "src/repo/devices/devices.repo.service";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";

export enum RefreshTokenStatus {
    Success,
    UserNotFound,
    UserDeviceNotFound,
    WrongDevice,
    TokenExpired
}

export class RefreshTokenDto {
    /**
     *
     */
    constructor(
        public status: RefreshTokenStatus,
        public accessToken?: string,
        public refreshToken?: string) { }
}

export class UsersSerivceRefreshTokenCommand {

    constructor(public refreshToken: JwtServiceUserRefreshTokenLoad, public deviceInfo: RequestDeviceEntity) { }
}

@Injectable()
@CommandHandler(UsersSerivceRefreshTokenCommand)
export class UsersSerivceRefreshTokenUseCase implements ICommandHandler<UsersSerivceRefreshTokenCommand, RefreshTokenDto>{
    /**
     *
     */
    constructor(private userRepo: UsersRepoService, private deviceRepo: DeviceRepoService, private jwtService: JwtHandlerService) { }

    async execute(command: UsersSerivceRefreshTokenCommand): Promise<RefreshTokenDto> {
        let foundUser = await this.userRepo.ReadOneByPropertyValue("id", command.refreshToken.id);

        if (!foundUser)
            return new RefreshTokenDto(RefreshTokenStatus.UserNotFound);

        let usedDevice = foundUser.devices.find(device => device.id === command.refreshToken.deviceId);
        if (!usedDevice)
            return new RefreshTokenDto(RefreshTokenStatus.UserDeviceNotFound)

        if (usedDevice.name !== command.deviceInfo.name)
            return new RefreshTokenDto(RefreshTokenStatus.WrongDevice)

        if (usedDevice.refreshTime !== command.refreshToken.time)
            return new RefreshTokenDto(RefreshTokenStatus.TokenExpired)

        usedDevice.ip = command.deviceInfo.ip;
        usedDevice.refreshTime = new Date();
        this.deviceRepo.UpdateOne(usedDevice);

        let tokens = await this.jwtService.GenerateUserLoginTokens(foundUser.id, foundUser.login, usedDevice);

        return new RefreshTokenDto(RefreshTokenStatus.Success, tokens.accessTokenCode, tokens.refreshTokenCode);
    }

}