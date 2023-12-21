import { Controller, Get, NotFoundException, Param, Query, UseFilters } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ReadAccessToken, TokenExpectation } from "src/auth/jwt/decorators/jwt.request.read.accessToken";
import { JwtServiceUserAccessTokenLoad } from "src/auth/jwt/entities/jwt.service.accessTokenLoad";
import { InputPaginator } from 'src/common/paginator/entities/query.paginator.input.entity';
import { OutputPaginator } from 'src/common/paginator/entities/query.paginator.output.entity';
import { QueryPaginator } from 'src/common/paginator/query.paginator.decorator';
import { PostInfo } from "src/features/posts/use-cases/post.service.get.post.by.id.usecase";
import { PostServiceGetManyCommand } from "src/features/posts/use-cases/post.service.get.posts.many.usecase";
import { DataBaseException } from 'src/features/superAdmin/controllers/exceptions/super.admin.controller.exception.filter';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { BlogRepoEntity } from 'src/repo/blogs/entity/blogs.repo.entity';
import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogRepo: BlogsRepoService,
    private postRepo: PostsRepoService,
    private comandBus: CommandBus
  ) {}

  @Get()
  async GetAll(
    @Query('searchNameTerm') nameTerm: string | undefined,
    @Query('sortBy') sortBy: keyof BlogRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
  ) {
    let { count, blogs } = await this.blogRepo.CountAndReadManyByName(
      nameTerm,
      sortBy,
      sortDirecrion,
      paginator.skipElements,
      paginator.pageSize,
      true,
    );

    let pagedBlogs = new OutputPaginator(count, blogs, paginator);
    return pagedBlogs;
  }

  @Get(':id')
  public async GetById(@Param('id') id: string) {
    let numId = +id;
    let blog = await this.blogRepo.ReadById(numId, true);

    if (blog) return blog;

    throw new NotFoundException();
  }

  //get -> hometask_13/api/blogs/{blogId}/posts
  @Get(':id/posts')
  @UseFilters(DataBaseException)
  async GetBlogsPosts(
    @Param('id') id: string,
    @Query('sortBy') sortBy: keyof PostRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  ) {

    let {count, postInfos} = await this.comandBus.execute<PostServiceGetManyCommand, {count: number, postInfos: PostInfo[]}>(new PostServiceGetManyCommand(tokenLoad?.id, sortBy, sortDirecrion, paginator.skipElements, paginator.pageSize))
    // let { count, posts } = await this.postRepo.ReadManyByBlogId(
    //   +id,
    //   sortBy,
    //   sortDirecrion,
    //   paginator.skipElements,
    //   paginator.pageSize,
    //   true,
    // );
    let pagedPosts = new OutputPaginator(count, postInfos, paginator);

    return pagedPosts;
  }
}
