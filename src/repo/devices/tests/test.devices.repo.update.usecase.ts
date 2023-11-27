import { TestingModule } from "@nestjs/testing";
import { TestDevicesRepoTestingModule } from "./settings/devices.repo.testingModule";
import { DeviceRepoService } from "../devices.repo.service";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";
import { UserControllerRegistrationEntity } from "src/features/users/controllers/entities/users.controller.registration.entity";
import { UsersRepoService } from "src/repo/users/users.repo.service";

describe(`DeviceRepoUpdate test`, () => {
    let module: TestingModule;
    let deviceRepo: DeviceRepoService;
    let userRepo: UsersRepoService;

    beforeAll(async () => {
        module = await TestDevicesRepoTestingModule.compile();

        await module.init();

        deviceRepo = module.get<DeviceRepoService>(DeviceRepoService);
        userRepo = module.get<UsersRepoService>(UsersRepoService);
    })

    afterAll(async () => {
        await module.close();
    })

    it('Device updated successfully', async () => {
        await deviceRepo.DeleteAll();
        await userRepo.DeleteAll();

        let device = new RequestDeviceEntity("phone", "1.1.1.125");
        let user = new UserControllerRegistrationEntity("Joe", "joe@mail.com", "123123");

        let savedUser = await userRepo.Create(user);

        let createdDevice = await deviceRepo.Create(device, savedUser);
        let initIp = createdDevice.ip;

        let newIp = "1.2.3.123";
        createdDevice.ip = newIp;

        let updatedDevice = await deviceRepo.UpdateOne(createdDevice);

        expect(createdDevice.name).toEqual(device.name);
        expect(initIp).toEqual(device.ip);

        expect(initIp).not.toEqual(updatedDevice.ip);
        expect(updatedDevice.ip).toEqual(newIp);
    })
})