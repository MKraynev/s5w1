import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminGuard } from 'src/auth/guards/admin/guard.admin';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { DeviceRepoService } from 'src/repo/devices/devices.repo.service';
import { UsersRepoService } from 'src/repo/users/users.repo.service';

// @UseGuards(AdminGuard)
@Controller('testing/all-data')
export class AdminTestingController {
  constructor(
    private userRepo: UsersRepoService,
    private deviceRepo: DeviceRepoService,
    private blogRepo: BlogsRepoService,
  ) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteAll() {
    this.blogRepo.DeleteAll();
    this.userRepo.DeleteAll();
    await this.deviceRepo.DeleteAll();

    return;
  }
}
