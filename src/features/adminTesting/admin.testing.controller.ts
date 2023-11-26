import { Controller, Delete, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { AdminGuard } from "src/auth/guards/admin/guard.admin";
import { UsersRepoService } from "src/repo/users/users.repo.service";

//@UseGuards(AdminGuard)
@Controller('testing/all-data')
export class AdminTestingController {

    constructor(private userRepo: UsersRepoService) { }


    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async DeleteAll() {
        await this.userRepo.DeleteAll();
        return;
    }
}