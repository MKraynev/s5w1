import { Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ReadRefreshToken } from "src/auth/jwt/decorators/jwt.request.read.refreshToken";
import { JwtServiceUserRefreshTokenLoad } from "src/auth/jwt/entities/jwt.service.refreshTokenLoad";
import { DeviceSerivceGetUserDevicesCommand, UserDevice } from "../use-cases/devices.service.getUsersDevices.usecase";
import { DeleteUserDevicesStatus, DeviceSerivceDeleteRestDevicesCommand } from "../use-cases/devices.service.deleteRestDevices.usecase";
import { DeleteCertainUserDeviceStatus, DeviceSerivceDeleteCertainDeviceCommand } from "../use-cases/devices.service.deleteCertainDevice.usecase";

@Controller('security/devices')
export class DeviceController {

    constructor(private commandBus: CommandBus) { }

    @Get()
    async GetDevices(@ReadRefreshToken() token: JwtServiceUserRefreshTokenLoad) {
        console.log('get devices by:', token)
        let devices = await this.commandBus.execute<DeviceSerivceGetUserDevicesCommand, UserDevice[]>(new DeviceSerivceGetUserDevicesCommand(token));
        console.log('Found devices:', devices);
        return devices;
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async DeleteDevices(@ReadRefreshToken() refreshToken: JwtServiceUserRefreshTokenLoad) {
        console.log('try del rest by', refreshToken)
        let delRestDevices = await this.commandBus.execute<DeviceSerivceDeleteRestDevicesCommand, DeleteUserDevicesStatus>(new DeviceSerivceDeleteRestDevicesCommand(refreshToken))
        console.log('Deleted by rest:', delRestDevices)
        return;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async DeleteCertainDevice(
        @Param('id') id: string,
        @ReadRefreshToken() refreshToken: JwtServiceUserRefreshTokenLoad
    ) {
        console.log('try del by id', id);
        let deleteStatus = await this.commandBus.execute<DeviceSerivceDeleteCertainDeviceCommand, DeleteCertainUserDeviceStatus>(new DeviceSerivceDeleteCertainDeviceCommand(refreshToken, id))

        switch (deleteStatus) {
            case DeleteCertainUserDeviceStatus.Success:
                console.log('deleted:', id)
                return;

            case DeleteCertainUserDeviceStatus.NotFound:
                throw new NotFoundException();
                break;

            case DeleteCertainUserDeviceStatus.WrongUserActionForbidden:
                throw new ForbiddenException();
                break;
        }
    }
}