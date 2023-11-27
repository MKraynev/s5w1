import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceRepoEntity } from "./entities/devices.repo.entity";
import { Repository } from "typeorm";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";
import { UserRepoEntity } from "../users/entities/users.repo.entity";
import { delay } from "rxjs";
import { UsersRepoService } from "../users/users.repo.service";

@Injectable()
export class DeviceRepoService {

    constructor(
        @InjectRepository(DeviceRepoEntity)
        private deviceRepo: Repository<DeviceRepoEntity>
    ) { }

    public async Create(deviceInfo: RequestDeviceEntity, user: UserRepoEntity): Promise<DeviceRepoEntity> {
        let repoDevice = DeviceRepoEntity.Init(deviceInfo, user);

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

    public async FindOneOrCreate(user: UserRepoEntity, deviceInfo: RequestDeviceEntity) {
        //{ user: userId },
        let findOne = await this.deviceRepo.findOne({
            where: [
                { name: deviceInfo.name }
            ]
        });

        if (!findOne)
            findOne = await this.Create(deviceInfo, user);

        findOne.UpdateRefreshTime();

        return await this.UpdateOne(findOne);

    }
}