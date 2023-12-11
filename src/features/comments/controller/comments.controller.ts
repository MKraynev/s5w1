import { Controller, Get, Param } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CommentsRepoService } from "src/repo/comments/comments.repo.service";
import { CommentsServiceGetCommentByIdCommand } from "../use-cases/comments.service.get.comment.by.id.usecase";
import { CommentInfo } from "src/features/posts/entities/post.controller.get.comment";
import { ReadAccessToken, TokenExpectation } from "src/auth/jwt/decorators/jwt.request.read.accessToken";
import { JwtServiceUserAccessTokenLoad } from "src/auth/jwt/entities/jwt.service.accessTokenLoad";

@Controller('comments')
export class CommentsController{

constructor(private commandBus: CommandBus) {}
    
@Get(':id')
    public async GetById(@Param('id') id: string,
    @ReadAccessToken(TokenExpectation.Possibly) tokenLoad: JwtServiceUserAccessTokenLoad) {
    let comment = await this.commandBus.execute<CommentsServiceGetCommentByIdCommand, CommentInfo>(new CommentsServiceGetCommentByIdCommand(id, tokenLoad?.id))

    return comment;
    }
}