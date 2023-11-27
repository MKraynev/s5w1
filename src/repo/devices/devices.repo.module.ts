import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceRepoEntity } from "./entities/devices.repo.entity";
import { Module } from "@nestjs/common";
import { DeviceRepoService } from "./devices.repo.service";

@Module({
    imports: [TypeOrmModule.forFeature([DeviceRepoEntity])],
    providers: [DeviceRepoService],
    exports: [DeviceRepoService]
})
export class DeviceRepoModule { }