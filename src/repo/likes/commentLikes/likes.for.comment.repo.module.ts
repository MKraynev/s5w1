import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForCommentRepoService } from './likes.for.comment.repo.service';
import { LikeForCommentRepoEntity } from "./entity/like.for.comment.repo.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeForCommentRepoEntity]),
  ],
  providers: [LikeForCommentRepoService],
  exports: [LikeForCommentRepoService],
})
export class LikesForCommentRepoModule {}
