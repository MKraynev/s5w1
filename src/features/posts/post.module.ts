import { Module } from '@nestjs/common';
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';
import { PostsController } from './controller/posts.controller';

@Module({
  imports: [PostsRepoModule],
  controllers: [PostsController],
})
export class PostModule {}
