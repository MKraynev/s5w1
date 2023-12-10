import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepoService } from 'src/repo/comments/comments.repo.service';
import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';
import { UsersRepoService } from 'src/repo/users/users.repo.service';
import { CommentSetEntity } from '../entities/post.controller.set.comment';
import { CommentInfo } from '../entities/post.controller.get.comment';

export class PostServiceSavePostCommentCommand {
  constructor(
    public userId: string,
    public postId: string,
    public comment: CommentSetEntity,
  ) {}
}

@CommandHandler(PostServiceSavePostCommentCommand)
@Injectable()
export class PostServiceSavePostCommentUseCase
  implements ICommandHandler<PostServiceSavePostCommentCommand, CommentInfo>
{
  constructor(
    private userRepo: UsersRepoService,
    private postRepo: PostsRepoService,
    private commentRepo: CommentsRepoService,
  ) {}
  async execute(
    command: PostServiceSavePostCommentCommand,
  ): Promise<CommentInfo> {
    let user = await this.userRepo.ReadOneById(command.userId);
    if (!user) throw new NotFoundException();

    let post = (await this.postRepo.ReadById(command.postId)) as PostRepoEntity;
    if (!post) throw new NotFoundException();

    let savedComment = await this.commentRepo.Create(
      user,
      post,
      command.comment,
    );

    return new CommentInfo(savedComment, user.id.toString(), user.login);
  }
}
