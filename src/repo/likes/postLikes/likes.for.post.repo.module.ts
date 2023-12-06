import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForPostRepoEntity } from './entity/like.for.posts.repo.entity';
import { LikeRepoService } from './likes.repo.service';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeForPostRepoEntity]),
    UsersRepoModule,
    PostsRepoModule,
  ],
  providers: [LikeRepoService],
  exports: [LikeRepoService],
})
export class LikesRepoModule {}
