import { InjectRepository } from '@nestjs/typeorm';
import { BlogRepoEntity } from './entity/blogs.repo.entity';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';
import { BlogCreateEntity } from 'src/features/superAdmin/controllers/entities/super.admin.create.blog.entity';
import { BlogGetResultEntity } from 'src/features/blogs/entities/blogs.controller.get.result.entity';

export class BlogsRepoService {
  constructor(
    @InjectRepository(BlogRepoEntity)
    private blogsRepo: Repository<BlogRepoEntity>,
  ) {}

  public async CountAndReadManyByName(
    namePattern: string,
    sortBy: keyof BlogRepoEntity = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number = 0,
    limit: number = 10,
    format: boolean = false,
  ): Promise<{
    count: number;
    blogs: BlogRepoEntity[] | BlogGetResultEntity[];
  }> {
    let nameSearchPatten: FindOptionsWhere<BlogRepoEntity> = {};

    let caseInsensitiveSearchPattern = (column: string, inputValue: string) =>
      `LOWER(${column}) Like '%${inputValue.toLowerCase()}%'`;

    if (namePattern)
      nameSearchPatten['name'] = Raw((alias) =>
        caseInsensitiveSearchPattern(alias, namePattern),
      );

    let orderObj: any = {};
    orderObj[sortBy] = sortDirection;

    let count = await this.blogsRepo.count({ where: nameSearchPatten });
    let blogs = await this.blogsRepo.find({
      where: nameSearchPatten,
      order: orderObj,
      skip: skip,
      take: limit,
    });

    if (format) {
      let formatedBlogs = blogs.map(
        (blogDb) => new BlogGetResultEntity(blogDb),
      );

      return { count, blogs: formatedBlogs };
    }

    return { count, blogs };
  }

  public async ReadById(
    id: number,
    format: boolean = false,
  ): Promise<BlogRepoEntity | BlogGetResultEntity> {
    let blog = await this.blogsRepo.findOneBy({ id: id });

    if (blog && format) return new BlogGetResultEntity(blog);

    return blog;
  }

  public async Create(
    blogData: BlogCreateEntity,
    format: boolean = false,
  ): Promise<BlogRepoEntity | BlogGetResultEntity> {
    let blog = BlogRepoEntity.Init(blogData);

    let savedBlog = await this.blogsRepo.save(blog);

    if (format) return new BlogGetResultEntity(savedBlog);

    return savedBlog;
  }

  public async Update(
    blog: BlogRepoEntity,
    format: boolean = false,
  ): Promise<BlogRepoEntity | BlogGetResultEntity> {
    let updatedBlog = await this.blogsRepo.save(blog);
    if (format) return new BlogGetResultEntity(updatedBlog);

    return updatedBlog;
  }

  public async UpdateById(
    blogId: number,
    blogData: BlogCreateEntity,
    format: boolean = false,
  ) {
    let blog = await this.blogsRepo.findOneBy({ id: blogId });

    if (!blog) return null;

    blog.name = blogData.name;
    blog.description = blogData.description;
    blog.websiteUrl = blogData.websiteUrl;

    let savedBlog = await this.blogsRepo.save(blog);

    if (format) return new BlogGetResultEntity(savedBlog);

    return savedBlog;
  }

  public async DeleteAll() {
    let deleteAll = await this.blogsRepo.delete({});

    return deleteAll.affected;
  }
  public async DeleteOne(id: number) {
    let del = await this.blogsRepo.delete({ id: id });

    return del.affected;
  }
}
