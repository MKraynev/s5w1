import { InjectRepository } from '@nestjs/typeorm';
import { BlogRepoEntity } from './entity/blogs.repo.entity';
import { Repository } from 'typeorm';
import { BlogCreateEntity } from 'src/features/superAdmin/controllers/entities/super.admin.create.blog.entity';

export class BlogsRepoService {
  /**
   *
   */
  constructor(
    @InjectRepository(BlogRepoEntity)
    private blogsRepo: Repository<BlogRepoEntity>,
  ) {}

  public async Create(blogData: BlogCreateEntity): Promise<BlogRepoEntity> {
    let blog = BlogRepoEntity.Init(blogData);

    return await this.blogsRepo.save(blog);
  }
}
