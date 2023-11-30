import { Module } from '@nestjs/common';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { AdminTestingController } from './controllers/super.admin.testing.controller';
import { DeviceRepoModule } from 'src/repo/devices/devices.repo.module';
import { SuperAdminBlogController } from './controllers/super.admin.blogs.controller';
import { BlogsRepoModule } from 'src/repo/blogs/blogs.repo.module';
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';

const adaminControllers = [AdminTestingController, SuperAdminBlogController];
const adminImports = [
  UsersRepoModule,
  DeviceRepoModule,
  BlogsRepoModule,
  PostsRepoModule,
];
@Module({
  imports: [...adminImports],
  controllers: [...adaminControllers],
})
export class SuperAdminModule {}
