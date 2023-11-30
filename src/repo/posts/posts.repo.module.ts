import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepoEntity } from './entity/posts.repo.entity';
import { PostsRepoService } from './posts.repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepoEntity])],
  providers: [PostsRepoService],
  exports: [PostsRepoService],
})
export class PostsRepoModule {}
