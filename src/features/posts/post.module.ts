import { Module } from "@nestjs/common";
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';
import { PostsController } from './controller/posts.controller';
import { CommentsRepoService } from 'src/repo/comments/comments.repo.service';
import { CommentRepoModule } from 'src/repo/comments/comments.repo.module';
import { LikesForPostRepoModule } from 'src/repo/likes/postLikes/likes.for.post.repo.module';
import { PostServiceSavePostCommentUseCase } from './use-cases/post.service.save.post.comment.usecase';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { CqrsModule } from "@nestjs/cqrs";
import { PostServiceGetPostCommentsUseCase } from "./use-cases/post.service.get.post.comments.usecase";
import { PostServiceGetPostByIdUseCase } from "./use-cases/post.service.get.post.by.id.usecase";

const PostUseCases = [PostServiceSavePostCommentUseCase, PostServiceGetPostCommentsUseCase, PostServiceGetPostByIdUseCase];

@Module({
  imports: [CqrsModule, PostsRepoModule, CommentRepoModule, LikesForPostRepoModule, UsersRepoModule],
  controllers: [PostsController],
  providers: [...PostUseCases],
})
export class PostModule {}
