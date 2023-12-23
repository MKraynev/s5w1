import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentInfo } from 'src/features/posts/entities/post.controller.get.comment';
import { CommentsRepoService } from 'src/repo/comments/comments.repo.service';
import { LikeForCommentRepoService } from 'src/repo/likes/commentLikes/likes.for.comment.repo.service';

export class CommentsServiceGetCommentByIdCommand {
    constructor(
        public commentId: string,
        public userId?: string
    ) {}
}

@CommandHandler(CommentsServiceGetCommentByIdCommand)
@Injectable()
export class CommentsServiceGetCommentByIdUseCase
    implements
        ICommandHandler<CommentsServiceGetCommentByIdCommand, CommentInfo>
{
    constructor(
        private commentRepo: CommentsRepoService,
        private likeRepo: LikeForCommentRepoService
    ) {}
    async execute(
        command: CommentsServiceGetCommentByIdCommand
    ): Promise<CommentInfo> {
        try {
            const [comment, userStatus, statistic] = await Promise.all([
                this.commentRepo.ReadOneById(command.commentId),
                this.likeRepo.GetUserStatus(command.commentId, command.userId),
                this.likeRepo.GetStatistic(command.commentId),
            ]);

            if (!comment) {
                throw new NotFoundException(
                    `Comment with ID ${command.commentId} not found`
                );
            }

            return new CommentInfo(
                comment,
                comment.user.id.toString(),
                comment.user.login,
                userStatus,
                statistic.like,
                statistic.dislike
            );
        } catch (error) {
            console.error(
                'Error in CommentsServiceGetCommentByIdUseCase:',
                error
            );
            throw error;
        }
    }
}
