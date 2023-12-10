import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForPostRepoEntity } from './entity/like.for.posts.repo.entity';
import { LikeForPostRepoService } from './likes.for.post.repo.service';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeForPostRepoEntity]),
    UsersRepoModule,
    PostsRepoModule,
  ],
  providers: [LikeForPostRepoService],
  exports: [LikeForPostRepoService],
})
export class LikesForPostRepoModule {}
