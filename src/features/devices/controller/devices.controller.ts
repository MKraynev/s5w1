import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ReadRefreshToken } from 'src/auth/jwt/decorators/jwt.request.read.refreshToken';
import { JwtServiceUserRefreshTokenLoad } from 'src/auth/jwt/entities/jwt.service.refreshTokenLoad';
import { DeviceSerivceGetUserDevicesCommand, UserDevice } from '../use-cases/devices.service.get.users.devices.usecase';
import {
  DeleteUserDevicesStatus,
  DeviceSerivceDeleteRestDevicesCommand,
} from '../use-cases/devices.service.delete.rest.devices.usecase';
import {
  DeleteCertainUserDeviceStatus,
  DeviceSerivceDeleteCertainDeviceCommand,
} from '../use-cases/devices.service.delete.certain.device.usecase';
import { _WAIT_ } from 'src/settings';

@Controller('security/devices')
export class DeviceController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  async GetDevices(@ReadRefreshToken() token: JwtServiceUserRefreshTokenLoad) {
    let devices = await this.commandBus.execute<DeviceSerivceGetUserDevicesCommand, UserDevice[]>(
      new DeviceSerivceGetUserDevicesCommand(token)
    );

    return devices;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteDevices(@ReadRefreshToken() refreshToken: JwtServiceUserRefreshTokenLoad) {
    let delRestDevices = await this.commandBus.execute<DeviceSerivceDeleteRestDevicesCommand, DeleteUserDevicesStatus>(
      new DeviceSerivceDeleteRestDevicesCommand(refreshToken)
    );

    await _WAIT_();

    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteCertainDevice(@Param('id') id: string, @ReadRefreshToken() refreshToken: JwtServiceUserRefreshTokenLoad) {
    let deleteStatus = await this.commandBus.execute<
      DeviceSerivceDeleteCertainDeviceCommand,
      DeleteCertainUserDeviceStatus
    >(new DeviceSerivceDeleteCertainDeviceCommand(refreshToken, id));

    await _WAIT_();

    switch (deleteStatus) {
      case DeleteCertainUserDeviceStatus.Success:
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
