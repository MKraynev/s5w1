import { Module } from "@nestjs/common";
import { BlogsController } from './controllers/blogs.controller';
import { BlogsRepoModule } from 'src/repo/blogs/blogs.repo.module';
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [BlogsRepoModule, PostsRepoModule, CqrsModule],
  controllers: [BlogsController],
})
export class BlogModule {}
