import { JwtService } from "@nestjs/jwt";
import { UserRegistrationLoad } from "src/auth/jwt/entities/jwt.service.userRegistrationLoad";
import { JwtServiceUserAccessTokenLoad } from "./entities/jwt.service.accessTokenLoad";
import { JwtServiceUserRefreshTokenLoad } from "./entities/jwt.service.refreshTokenLoad";
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "src/settings";
import { SignOptions } from "jsonwebtoken";
import { RequestDeviceMetaData } from "src/adapters/deviceMetaData/entities/request.deviceMetaData.entity";
import { Injectable } from "@nestjs/common";

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

    public async GenerateUserLoginTokens(userId: number, userName: string, userDevice: RequestDeviceMetaData) {
        let accessJwtOption: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRE }
        let refreshJwtOption: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRE }

        let accessTokenData: JwtServiceUserAccessTokenLoad = {
            id: userId,
            login: userName
        }

        // device.refreshTime = new Date();

        let refreshTokenData: JwtServiceUserRefreshTokenLoad = {
            id: userId,
            login: userName,
            time: new Date().toISOString(),
            deviceId: 0
        }


        let accessTokenCode = await this.jwtService.signAsync(accessTokenData, accessJwtOption);
        let refreshTokenCode = await this.jwtService.signAsync(refreshTokenData, refreshJwtOption);

        return { accessTokenCode, refreshTokenCode }
    }
}