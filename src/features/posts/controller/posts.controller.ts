import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from 'src/auth/guards/common/jwt-auth.guard';
import {
  ReadAccessToken,
  TokenExpectation,
} from 'src/auth/jwt/decorators/jwt.request.read.accessToken';
import { JwtServiceUserAccessTokenLoad } from 'src/auth/jwt/entities/jwt.service.accessTokenLoad';
import { InputPaginator } from 'src/common/paginator/entities/query.paginator.input.entity';
import { OutputPaginator } from 'src/common/paginator/entities/query.paginator.output.entity';
import { QueryPaginator } from 'src/common/paginator/query.paginator.decorator';
import { ValidateParameters } from 'src/common/pipes/validation.pipe';
import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';
import { CommentSetEntity } from '../entities/post.controller.set.comment';
import { CommentsRepoService } from 'src/repo/comments/comments.repo.service';
import { LikeForPostRepoService } from 'src/repo/likes/postLikes/likes.for.post.repo.service';
import { LikeSetEntity } from '../entities/post.controller.set.like.status';
import { CommandBus } from '@nestjs/cqrs';
import { PostServiceSavePostCommentCommand } from '../use-cases/post.service.save.post.comment.usecase';
import { CommentInfo } from '../entities/post.controller.get.comment';
import { CommentRepoEntity } from "src/repo/comments/entities/commen.repo.entity";
import { PostServiceGetPostCommentsCommand } from "../use-cases/post.service.get.post.comments.usecase";
import { PostInfo, PostServiceGetPostByIdCommand } from "../use-cases/post.service.get.post.by.id.usecase";
import { PostServiceGetManyCommand } from "../use-cases/post.service.get.posts.many.usecase";

@Controller('posts')
export class PostsController {
  constructor(
    private postRepo: PostsRepoService,
    private commentRepo: CommentsRepoService,
    private likeRepo: LikeForPostRepoService,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async GetPosts(
    @Query('sortBy') sortBy: keyof PostRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  ) {
    // let { count, posts } = await this.postRepo.ReadMany(
    //   sortBy,
    //   sortDirecrion,
    //   paginator.skipElements,
    //   paginator.pageSize,
    //   true,
    // );

    await new Promise((f) => setTimeout(f, 1500));
    
    let {count, postInfos} = await this.commandBus.execute<PostServiceGetManyCommand, {count: number, postInfos: PostInfo[]}>(new PostServiceGetManyCommand(undefined, tokenLoad?.id, sortBy, sortDirecrion, paginator.skipElements, paginator.pageSize))
    let pagedPosts = new OutputPaginator(count, postInfos, paginator);
    return pagedPosts;
  }

  @Get(':id')
  async GetPostById(
    @Param('id') id: string,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  ) {
    
    await new Promise((f) => setTimeout(f, 1500));
    let post = await this.commandBus.execute<PostServiceGetPostByIdCommand, PostInfo>(new PostServiceGetPostByIdCommand(id, tokenLoad?.id))

    return post;
    // let post = await this.postRepo.ReadById(id, true);

    // if (post) return post;

    // throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async SaveComment(
    @Param('id') id: string,
    @Body(new ValidateParameters()) commentData: CommentSetEntity,
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let comment = await this.commandBus.execute<
      PostServiceSavePostCommentCommand,
      CommentInfo
    >(new PostServiceSavePostCommentCommand(tokenLoad.id, id, commentData));

    return comment;
  }

  @Get(":id/comments")
    async GetPostComments(
        @Query('searchNameTerm') nameTerm: string | undefined,
        @Query('sortBy') sortBy: keyof (CommentRepoEntity) = "createdAt",
        @Query('sortDirection') sortDirecrion: "desc" | "asc" = "desc",
        @QueryPaginator() paginator: InputPaginator,
        @Param('id') id: string,
        @ReadAccessToken(TokenExpectation.Possibly) tokenLoad: JwtServiceUserAccessTokenLoad | undefined
    ) {
        let {count, comments} = await this.commandBus.execute<PostServiceGetPostCommentsCommand, {count: number, comments: CommentInfo[]}>(
          new PostServiceGetPostCommentsCommand(id, sortBy, sortDirecrion, tokenLoad?.id, paginator.skipElements, paginator.pageSize)
        )
        
        let result = new OutputPaginator(count, comments, paginator);

        return result;
    }

  ///hometask_19/api/posts/{postId}/like-status
  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async PutLike(
    @Body(new ValidateParameters()) likeData: LikeSetEntity,
    @Param('id') id: string,
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    
    let savedLikestatus = await this.likeRepo.SetUserLikeForPost(
      tokenLoad.id,
      likeData.likeStatus,
      id,
    );

    await new Promise((f) => setTimeout(f, 1500));
    
    return;
  }

  
}
