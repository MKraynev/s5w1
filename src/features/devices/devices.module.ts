import { Module } from "@nestjs/common";
import { DeviceSerivceGetUserDevicesUsecase } from "./use-cases/devices.service.getUsersDevices.usecase";
import { DeviceController } from "./controller/devices.controller";
import { DeviceRepoModule } from "src/repo/devices/devices.repo.module";
import { CqrsModule } from "@nestjs/cqrs";
import { DeviceSerivceDeleteRestDevicesUseCase } from "./use-cases/devices.service.deleteRestDevices.usecase";
import { DeviceSerivceDeleteCertainDeviceUseCase } from "./use-cases/devices.service.deleteCertainDevice.usecase";

export const DeviceUseCases = [
    DeviceSerivceGetUserDevicesUsecase,
    DeviceSerivceDeleteRestDevicesUseCase,
    DeviceSerivceDeleteCertainDeviceUseCase
]

@Module({
    imports: [DeviceRepoModule, CqrsModule],
    controllers: [DeviceController],
    providers: [...DeviceUseCases]
})
export class DevicesModule { }