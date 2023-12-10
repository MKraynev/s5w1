import { Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentInfo } from "src/features/posts/entities/post.controller.get.comment";
import { CommentsRepoService } from "src/repo/comments/comments.repo.service";
import { LikeForPostRepoService } from "src/repo/likes/postLikes/likes.for.post.repo.service";

export class CommentsServiceGetCommentByIdCommand {
	constructor(public commentId: string) {}
}
  
  @CommandHandler(CommentsServiceGetCommentByIdCommand)
  @Injectable()
  export class PostServiceSavePostCommentUseCase
    implements ICommandHandler<CommentsServiceGetCommentByIdCommand, CommentInfo>
  {
    constructor(
    //   private userRepo: UsersRepoService,
    //   private postRepo: PostsRepoService,
      private commentRepo: CommentsRepoService,
      private likeRepo: LikeForPostRepoService
    ) {}
    async execute(
      command: CommentsServiceGetCommentByIdCommand,
    ): Promise<CommentInfo> {
    //   let user = await this.userRepo.ReadOneById(command.userId);
    //   if (!user) throw new NotFoundException();
  
    //   let post = (await this.postRepo.ReadById(command.postId)) as PostRepoEntity;
    //   if (!post) throw new NotFoundException();


  
      let comment = await this.commentRepo.ReadOneById(command.commentId);
      if(!comment)
      throw new NotFoundException();
  
    //TODO добавить поиск лайков для комментов
    //добавить установку значений в сущность

      return new CommentInfo(comment, comment.user.id.toString(), comment.user.login);
    }
  }
  