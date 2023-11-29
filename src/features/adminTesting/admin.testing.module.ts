import { Module } from "@nestjs/common";
import { UsersRepoModule } from "src/repo/users/users.repo.module";
import { AdminTestingController } from "./admin.testing.controller";
import { DeviceRepoModule } from "src/repo/devices/devices.repo.module";

@Module({
    imports: [UsersRepoModule, DeviceRepoModule],
    controllers: [AdminTestingController]
})
export class AdminTestingModule { }