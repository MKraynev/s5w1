import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin/guard.admin';
import { ValidateParameters } from 'src/common/pipes/validation.pipe';
import { BlogCreateEntity } from './entities/super.admin.create.blog.entity';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';

@Controller('sa/blogs')
export class SuperAdminBlogController {
  constructor(private blogRepo: BlogsRepoService) {}

  //post -> hometask_13/api/blogs
  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async saveBlog(@Body(new ValidateParameters()) blog: BlogCreateEntity) {
    let savedBlog = await this.blogRepo.Create(blog);

    let { updatedAt, posts, ...rest } = savedBlog;

    return rest;
  }
}
