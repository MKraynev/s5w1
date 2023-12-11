import { Module } from "@nestjs/common";
import { CommentRepoModule } from "src/repo/comments/comments.repo.module";
import { CommentsServiceGetCommentByIdUseCase } from "./use-cases/comments.service.get.comment.by.id.usecase";
import { CommentsController } from "./controller/comments.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { LikesForCommentRepoModule } from "src/repo/likes/commentLikes/likes.for.comment.repo.module";
import { CommentsServiceDeleteByIdUseCase } from "./use-cases/comments.service.delete.by.id.usecase";
import { CommentServiceUpdateByIdUseCase } from "./use-cases/comments.service.update.by.id.usecase";


const CommentUseCases = [CommentsServiceGetCommentByIdUseCase, CommentsServiceDeleteByIdUseCase, CommentServiceUpdateByIdUseCase]

@Module({
    imports:[CqrsModule, CommentRepoModule, LikesForCommentRepoModule],
    controllers: [CommentsController],
    providers: [...CommentUseCases],
})
export class CommentsModule{}