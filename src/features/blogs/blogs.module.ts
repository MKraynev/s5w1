import { Module } from '@nestjs/common';
import { BlogsController } from './controllers/blogs.controller';
import { BlogsRepoModule } from 'src/repo/blogs/blogs.repo.module';

@Module({
  imports: [BlogsRepoModule],
  controllers: [BlogsController],
})
export class BlogModule {}
