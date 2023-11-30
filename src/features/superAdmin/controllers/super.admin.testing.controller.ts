import { Controller, Delete, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { AdminGuard } from "src/auth/guards/admin/guard.admin";
import { DeviceRepoService } from "src/repo/devices/devices.repo.service";
import { UsersRepoService } from "src/repo/users/users.repo.service";

//@UseGuards(AdminGuard)
@Controller('testing/all-data')
export class AdminTestingController {

    constructor(private userRepo: UsersRepoService, private deviceRepo: DeviceRepoService) { }


    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async DeleteAll() {
        this.userRepo.DeleteAll();
        await this.deviceRepo.DeleteAll();

        return;
    }
}