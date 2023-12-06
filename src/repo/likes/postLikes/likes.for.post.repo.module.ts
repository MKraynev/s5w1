import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForPostRepoEntity } from './entity/like.for.posts.repo.entity';
import { LikeRepoService } from './likes.repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikeForPostRepoEntity])],
  providers: [LikeRepoService],
})
export class LikesRepoModule {}
