import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CommentsRepoService } from "src/repo/comments/comments.repo.service";
import { CommentsServiceGetCommentByIdCommand } from "../use-cases/comments.service.get.comment.by.id.usecase";
import { CommentInfo } from "src/features/posts/entities/post.controller.get.comment";
import { ReadAccessToken, TokenExpectation } from "src/auth/jwt/decorators/jwt.request.read.accessToken";
import { JwtServiceUserAccessTokenLoad } from "src/auth/jwt/entities/jwt.service.accessTokenLoad";
import { JwtAuthGuard } from "src/auth/guards/common/jwt-auth.guard";
import { CommentsServiceDeleteByIdCommand } from "../use-cases/comments.service.delete.by.id.usecase";
import { ValidateParameters } from "src/common/pipes/validation.pipe";
import { CommentSetEntity } from "src/features/posts/entities/post.controller.set.comment";
import { CommentServiceUpdateByIdCommand } from "../use-cases/comments.service.update.by.id.usecase";

@Controller('comments')
export class CommentsController{

constructor(private commandBus: CommandBus) {}
    
@Get(':id')
    public async GetById(@Param('id') id: string,
    @ReadAccessToken(TokenExpectation.Possibly) tokenLoad: JwtServiceUserAccessTokenLoad) {
    let comment = await this.commandBus.execute<CommentsServiceGetCommentByIdCommand, CommentInfo>(new CommentsServiceGetCommentByIdCommand(id, tokenLoad?.id))

    return comment;
    }

    //delete -> /hometask_14/api/comments/{commentId}
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async DeleteComment(
        @Param('id') id: string,
        @ReadAccessToken(TokenExpectation.Expected) tokenLoad: JwtServiceUserAccessTokenLoad
    ) {
        let comment = await this.commandBus.execute<CommentsServiceDeleteByIdCommand, number>(new CommentsServiceDeleteByIdCommand(id, tokenLoad.id))
        return;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async UpdateComment(
        @Param('id') id: string,
        @Body(new ValidateParameters()) commentData: CommentSetEntity,
        @ReadAccessToken(TokenExpectation.Expected) tokenLoad: JwtServiceUserAccessTokenLoad
    ) {
        let commentUpdated = await this.commandBus.execute<CommentServiceUpdateByIdCommand, boolean>(new CommentServiceUpdateByIdCommand(id, tokenLoad.id, commentData))
        return;
    }
}

