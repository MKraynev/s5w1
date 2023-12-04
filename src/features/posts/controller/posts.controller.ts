import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ReadAccessToken,
  TokenExpectation,
} from 'src/auth/jwt/decorators/jwt.request.read.accessToken';
import { JwtServiceUserAccessTokenLoad } from 'src/auth/jwt/entities/jwt.service.accessTokenLoad';
import { InputPaginator } from 'src/common/paginator/entities/query.paginator.inputEntity';
import { OutputPaginator } from 'src/common/paginator/entities/query.paginator.outputEntity';
import { QueryPaginator } from 'src/common/paginator/query.paginator.decorator';
import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';

@Controller('posts')
export class PostsController {
  constructor(private postRepo: PostsRepoService) {}

  @Get()
  async GetPosts(
    @Query('sortBy') sortBy: keyof PostRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  ) {
    let { count, posts } = await this.postRepo.ReadMany(
      sortBy,
      sortDirecrion,
      paginator.skipElements,
      paginator.pageSize,
      true,
    );

    let pagedPosts = new OutputPaginator(count, posts, paginator);
    return pagedPosts;
  }

  @Get(':id')
  async GetPostById(
    @Param('id') id: string,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  ) {
    let post = await this.postRepo.ReadById(+id, true);

    if (post) return post;

    throw new NotFoundException();
  }
}
