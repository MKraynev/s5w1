import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceRepoEntity } from "./entities/devices.repo.entity";
import { Repository } from "typeorm";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";
import { UserRepoEntity } from "../users/entities/users.repo.entity";
import { delay } from "rxjs";

@Injectable()
export class DeviceRepoService {

    constructor(
        @InjectRepository(DeviceRepoEntity)
        private deviceRepo: Repository<DeviceRepoEntity>
    ) { }

    public async Create(deviceInfo: RequestDeviceEntity, userId: number): Promise<DeviceRepoEntity> {
        let repoDevice = DeviceRepoEntity.Init(deviceInfo, userId);

        let savedDevice = await this.deviceRepo.save(repoDevice);

        return savedDevice;
    }

    public async UpdateOne(device: DeviceRepoEntity): Promise<DeviceRepoEntity> {
        let updatedDevice = await this.deviceRepo.save(device);

        return updatedDevice;
    }

    public async DeleteAll() {
        let delAll = await this.deviceRepo.delete({})

        return delAll.affected;
    }

    public async FindOneOrCreate(userId: number, deviceInfo: RequestDeviceEntity) {
        let findOne = await this.deviceRepo.findOne({
            where: [
                { userId: userId },
                { name: deviceInfo.name }
            ]
        });

        if (!findOne)
            findOne = await this.Create(deviceInfo, userId);

        findOne.UpdateRefreshTime();

        return await this.UpdateOne(findOne);

    }
}