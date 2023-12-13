import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepoEntity } from './entity/posts.repo.entity';
import { PostsRepoService } from './posts.repo.service';
import { BlogsRepoModule } from '../blogs/blogs.repo.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepoEntity]), BlogsRepoModule],
  providers: [PostsRepoService],
  exports: [PostsRepoService],
})
export class PostsRepoModule {}
