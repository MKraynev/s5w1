import { Module } from '@nestjs/common';
import { BlogsController } from './controllers/blogs.controller';
import { BlogsRepoModule } from 'src/repo/blogs/blogs.repo.module';
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';

@Module({
  imports: [BlogsRepoModule, PostsRepoModule],
  controllers: [BlogsController],
})
export class BlogModule {}
