import { Module } from '@nestjs/common';
import { CommentRepoModule } from 'src/repo/comments/comments.repo.module';
import { CommentsServiceGetCommentByIdUseCase } from './use-cases/comments.service.get.comment.by.id.usecase';
import { CommentsController } from './controller/comments.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { LikesForCommentRepoModule } from 'src/repo/likes/commentLikes/likes.for.comment.repo.module';
import { CommentsServiceDeleteByIdUseCase } from './use-cases/comments.service.delete.by.id.usecase';
import { CommentServiceUpdateByIdUseCase } from './use-cases/comments.service.update.by.id.usecase';
import { CommentServicePutLikeStatusUseCase } from './use-cases/comments.service.put.like.status.usecase';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';

const CommentUseCases = [
    CommentsServiceGetCommentByIdUseCase,
    CommentsServiceDeleteByIdUseCase,
    CommentServiceUpdateByIdUseCase,
    CommentServicePutLikeStatusUseCase,
];

@Module({
    imports: [
        CqrsModule,
        CommentRepoModule,
        LikesForCommentRepoModule,
        UsersRepoModule,
    ],
    controllers: [CommentsController],
    providers: [...CommentUseCases],
})
export class CommentsModule {}
