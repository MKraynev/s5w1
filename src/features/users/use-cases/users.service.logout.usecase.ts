import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtServiceUserRefreshTokenLoad } from "src/auth/jwt/entities/jwt.service.refreshTokenLoad";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";
import { DeviceRepoService } from "src/repo/devices/devices.repo.service";

export enum LogoutStatus {
    Success,
    ExpiredToken,
    WrongDevice,
    DeviceNotFound
}

export class UsersServiceLogoutCommand {

    constructor(
        public requestDeviceInfo: RequestDeviceEntity,
        public refreshToken: JwtServiceUserRefreshTokenLoad) { }
}

@Injectable()
@CommandHandler(UsersServiceLogoutCommand)
export class UsersServiceLogoutUseCase implements ICommandHandler<UsersServiceLogoutCommand, LogoutStatus>{

    constructor(private deviceRepo: DeviceRepoService) { }

    async execute(command: UsersServiceLogoutCommand): Promise<LogoutStatus> {
        let foundDevice = await this.deviceRepo.ReadOneFullyById(command.refreshToken.deviceId);

        if (!foundDevice)
            return LogoutStatus.DeviceNotFound;

        if (foundDevice.refreshTime.toISOString() !== command.refreshToken.time)
            return LogoutStatus.ExpiredToken;

        let delDevice = await this.deviceRepo.DeleteOne(command.refreshToken.deviceId);

        return LogoutStatus.Success;
    }
}