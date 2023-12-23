import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepoService } from 'src/repo/comments/comments.repo.service';
import { LikeForCommentRepoService } from 'src/repo/likes/commentLikes/likes.for.comment.repo.service';
import { AvailableLikeStatus } from 'src/repo/likes/postLikes/entity/like.for.posts.repo.entity';
import { UsersRepoService } from 'src/repo/users/users.repo.service';

export enum CommentServiceSetLikeStatus {
    CommentNotFound,
    UserNotFound,
    Success,
}

export class CommentServicePutLikeStatusCommand {
    constructor(
        public commentId: string,
        public userId: string,
        public status: AvailableLikeStatus
    ) {}
}

@Injectable()
@CommandHandler(CommentServicePutLikeStatusCommand)
export class CommentServicePutLikeStatusUseCase
    implements
        ICommandHandler<
            CommentServicePutLikeStatusCommand,
            CommentServiceSetLikeStatus
        >
{
    constructor(
        private likeRepo: LikeForCommentRepoService,
        private userRepo: UsersRepoService,
        private commentRepo: CommentsRepoService
    ) {}

    async execute(
        command: CommentServicePutLikeStatusCommand
    ): Promise<CommentServiceSetLikeStatus> {
        let { 0: comment, 1: user } = await Promise.all([
            this.commentRepo.ReadOneById(command.commentId),
            this.userRepo.ReadOneById(command.userId),
        ]);
        if (!comment) return CommentServiceSetLikeStatus.CommentNotFound;

        if (!user) return CommentServiceSetLikeStatus.UserNotFound;

        let like = await this.likeRepo.SetUserLikeForComment(
            user,
            command.status,
            comment
        );

        return CommentServiceSetLikeStatus.Success;
    }
}
