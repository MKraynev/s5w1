import { InjectRepository } from '@nestjs/typeorm';
import { BlogRepoEntity } from './entity/blogs.repo.entity';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';
import { BlogCreateEntity } from 'src/features/superAdmin/controllers/entities/super.admin.create.blog.entity';

export class BlogsRepoService {
  /**
   *
   */
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
  ) {
    let nameSearchPatten: FindOptionsWhere<BlogRepoEntity> = {};

    let caseInsensitiveSearchPattern = (column: string, inputValue: string) =>
      `LOWER(${column}) Like '%${inputValue.toLowerCase()}%'`;

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

    return { count, blogs };
  }

  public async Create(blogData: BlogCreateEntity): Promise<BlogRepoEntity> {
    let blog = BlogRepoEntity.Init(blogData);

    return await this.blogsRepo.save(blog);
  }

  public async Update(blog: BlogRepoEntity) {
    return await this.blogsRepo.save(blog);
  }

  public async UpdateById(blogId: number, blogData: BlogCreateEntity) {
    let blog = await this.blogsRepo.findOneBy({ id: blogId });

    if (!blog) return null;

    blog.name = blogData.name;
    blog.description = blogData.description;
    blog.websiteUrl = blogData.websiteUrl;

    return await this.blogsRepo.save(blog);
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
