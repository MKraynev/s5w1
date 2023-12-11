import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForCommentRepoService } from './likes.for.comment.repo.service';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { LikeForCommentRepoEntity } from "./entity/like.for.comment.repo.entity";
import { CommentRepoModule } from "src/repo/comments/comments.repo.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeForCommentRepoEntity]),
    UsersRepoModule,
    CommentRepoModule,
  ],
  providers: [LikeForCommentRepoService],
  exports: [LikeForCommentRepoService],
})
export class LikesForCommentRepoModule {}
