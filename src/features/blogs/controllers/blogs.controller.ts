import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { InputPaginator } from 'src/common/paginator/entities/query.paginator.inputEntity';
import { OutputPaginator } from 'src/common/paginator/entities/query.paginator.outputEntity';
import { QueryPaginator } from 'src/common/paginator/query.paginator.decorator';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { BlogRepoEntity } from 'src/repo/blogs/entity/blogs.repo.entity';

@Controller('blogs')
export class BlogsController {
  constructor(private blogRepo: BlogsRepoService) {}

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
}
