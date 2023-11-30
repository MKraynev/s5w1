import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin/guard.admin';
import { ValidateParameters } from 'src/common/pipes/validation.pipe';
import { BlogCreateEntity } from './entities/super.admin.create.blog.entity';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { BlogRepoEntity } from 'src/repo/blogs/entity/blogs.repo.entity';
import { QueryPaginator } from 'src/common/paginator/query.paginator.decorator';
import { InputPaginator } from 'src/common/paginator/entities/query.paginator.inputEntity';
import { OutputPaginator } from 'src/common/paginator/entities/query.paginator.outputEntity';
import {
  PostCreateEntity,
  PostWithExpectedBlogIdCreateEntity,
} from './entities/super.admin.create.post.entity';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';

@Controller('sa/blogs')
export class SuperAdminBlogController {
  constructor(
    private blogRepo: BlogsRepoService,
    private postRepo: PostsRepoService,
  ) {}

  //get -> hometask_13/api/blogs
  @Get()
  async getBlogs(
    @Query('searchNameTerm') nameTerm: string | undefined,
    @Query('sortBy') sortBy: keyof BlogRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
  ) {
    let searchPropName: keyof BlogRepoEntity | undefined = nameTerm
      ? 'name'
      : undefined;

    let { count, blogs } = await this.blogRepo.CountAndReadManyByName(
      searchPropName,
      sortBy,
      sortDirecrion,
      paginator.skipElements,
      paginator.pageSize,
    );

    let pagedBlogs = new OutputPaginator(count, blogs, paginator);
    return pagedBlogs;
  }

  //post -> hometask_13/api/blogs
  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async saveBlog(@Body(new ValidateParameters()) blog: BlogCreateEntity) {
    let savedBlog = await this.blogRepo.Create(blog);

    let { updatedAt, posts, id, ...rest } = savedBlog;
    rest['id'] = id.toString();
    return rest;
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async UpdateBlog(
    @Param('id') id: string,
    @Body(new ValidateParameters()) blogData: BlogCreateEntity,
  ) {
    let updatedBlog = await this.blogRepo.UpdateById(+id, blogData);

    if (updatedBlog) {
      let { updatedAt, posts, id, ...rest } = updatedBlog;
      rest['id'] = id.toString();
      return rest;
    }

    throw new NotFoundException();
  }

  //delete -> /hometask_13/api/blogs/{id}
  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteBlog(@Param('id') id: string) {
    let count = await this.blogRepo.DeleteOne(+id);

    if (count > 0) return;

    throw new NotFoundException();
  }

  //post -> hometask_13/api/blogs/{blogId}/posts
  @Post(':id/posts')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async SaveBlogsPosts(
    @Param('id') id: string,
    @Body(new ValidateParameters())
    postData: PostWithExpectedBlogIdCreateEntity,
  ) {
    let createdPost = await this.postRepo.Create(postData, postData.blogId);

    return createdPost;
    // switch (createPost.executionStatus) {
    //   case ServiceExecutionResultStatus.Success:
    //     let { updatedAt, ...returnPost } = createPost.executionResultObject;
    //     let decoratedPost = await this.likeService.DecorateWithExtendedInfo(
    //       undefined,
    //       'posts',
    //       returnPost.id,
    //       returnPost,
    //     );

    //     return decoratedPost;
    //     break;

    //   default:
    //   case ServiceExecutionResultStatus.NotFound:
    //     throw new NotFoundException();
    //     break;
    // }
  }
}
