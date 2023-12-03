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
  UseFilters,
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
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { DataBaseException } from './exceptions/super.admin.controller.exception.filter';
import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';

@Controller('sa/blogs')
@UseGuards(AdminGuard)
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
  @HttpCode(HttpStatus.CREATED)
  async saveBlog(@Body(new ValidateParameters()) blog: BlogCreateEntity) {
    let savedBlog = await this.blogRepo.Create(blog, true);

    return savedBlog;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async UpdateBlog(
    @Param('id') id: string,
    @Body(new ValidateParameters()) blogData: BlogCreateEntity,
  ) {
    let updatedBlog = await this.blogRepo.UpdateById(+id, blogData, true);

    if (updatedBlog) {
      return updatedBlog;
    }

    throw new NotFoundException();
  }

  //delete -> /hometask_13/api/blogs/{id}
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteBlog(@Param('id') id: string) {
    let count = await this.blogRepo.DeleteOne(+id);

    if (count > 0) return;

    throw new NotFoundException();
  }

  //post -> hometask_13/api/blogs/{blogId}/posts
  @Post(':id/posts')
  @UseFilters(DataBaseException)
  @HttpCode(HttpStatus.CREATED)
  async SaveBlogsPosts(
    @Param('id') id: string,
    @Body(new ValidateParameters())
    postData: PostWithExpectedBlogIdCreateEntity,
  ) {
    let createdPost = await this.postRepo.Create(postData, postData.blogId);

    return createdPost;
  }

  @Get(':id/posts')
  @UseFilters(DataBaseException)
  async GetBlogsPosts(
    @Param('id') id: string,
    @Query('searchNameTerm') nameTerm: string | undefined,
    @Query('sortBy') sortBy: keyof PostRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
  ) {
    let findPosts = await this.postRepo.ReadManyByBlogId(
      +id,
      sortBy,
      sortDirecrion,
      paginator.skipElements,
      paginator.pageSize,
    );

    let decoratedPosts = findPosts.posts.map((post) => {
      let { id, updatedAt, ...rest } = post;
    });
  }
}
