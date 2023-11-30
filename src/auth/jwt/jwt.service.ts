import { JwtService } from "@nestjs/jwt";
import { UserRegistrationLoad } from "src/auth/jwt/entities/jwt.service.userRegistrationLoad";
import { JwtServiceUserAccessTokenLoad } from "./entities/jwt.service.accessTokenLoad";
import { JwtServiceUserRefreshTokenLoad } from "./entities/jwt.service.refreshTokenLoad";
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "src/settings";
import { SignOptions } from "jsonwebtoken";
import { Injectable } from "@nestjs/common";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";
import { DeviceRepoEntity } from "src/repo/devices/entities/devices.repo.entity";
import { JwtServicePasswordRecoveryTokenLoad } from "./entities/jwt.service.passwordRecoveryLoad";

@Injectable()
export class JwtHandlerService {

    constructor(private jwtService: JwtService) { }

    public async ReadUserRegistrationCode(code: string) {
        let tokenLoad: UserRegistrationLoad = await this.jwtService.verifyAsync(code);

        return tokenLoad;
    }

    public async GenerateUserRegistrationCode(userRegistrationDto: UserRegistrationLoad) {
        let token = await this.jwtService.signAsync(userRegistrationDto);

        return token;
    }

    public async GenerateUserLoginTokens(userId: number, userName: string, userDevice: DeviceRepoEntity) {
        let accessJwtOption: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRE }
        let refreshJwtOption: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRE }

        let accessTokenData: JwtServiceUserAccessTokenLoad = {
            id: userId,
            login: userName
        }

        // device.refreshTime = new Date();

        let refreshTokenData: JwtServiceUserRefreshTokenLoad = {
            id: userId.toString(),
            login: userName,
            time: userDevice.refreshTime.toISOString(),
            deviceId: userDevice.id.toString()
        }


        let accessTokenCode = await this.jwtService.signAsync(accessTokenData, accessJwtOption);
        let refreshTokenCode = await this.jwtService.signAsync(refreshTokenData, refreshJwtOption);

        return { accessTokenCode, refreshTokenCode }
    }

    public async ReadRefreshToken(token: string): Promise<JwtServiceUserRefreshTokenLoad> {
        let tokenData: JwtServiceUserRefreshTokenLoad = await this.jwtService.verifyAsync(token);

        return tokenData;
    }

    public async GeneratePasswordRecoveryToken(userId: number, recoveryTime: Date): Promise<string> {
        let token: JwtServicePasswordRecoveryTokenLoad = {
            id: userId.toString(),
            recoveryTime: recoveryTime
        }
        let tokenVal = await this.jwtService.signAsync(token);

        return tokenVal;
    }

    public async ReadPasswordRecoveryToken(token: string): Promise<JwtServicePasswordRecoveryTokenLoad> {
        let decoded = await this.jwtService.verifyAsync(token) as JwtServicePasswordRecoveryTokenLoad;

        return decoded;
    }
}