import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepoEntity } from './entities/commen.repo.entity';
import { CommentsRepoService } from './comments.repo.service';
import { UsersRepoModule } from '../users/users.repo.module';
import { PostsRepoModule } from '../posts/posts.repo.module';
import { LikesForCommentRepoModule } from '../likes/commentLikes/likes.for.comment.repo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepoEntity]),
    UsersRepoModule,
    PostsRepoModule,
    LikesForCommentRepoModule,
  ],
  providers: [CommentsRepoService],
  exports: [CommentsRepoService],
})
export class CommentRepoModule {}
