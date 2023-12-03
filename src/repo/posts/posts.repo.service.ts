import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PostRepoEntity } from './entity/posts.repo.entity';
import {
  PostCreateEntity,
  PostWithExpectedBlogIdCreateEntity,
} from 'src/features/superAdmin/controllers/entities/super.admin.create.post.entity';

export class PostsRepoService {
  constructor(
    @InjectRepository(PostRepoEntity)
    private postsRepo: Repository<PostRepoEntity>,
  ) {}

  public async ReadManyByBlogId(
    blogId: number,
    sortBy: keyof PostRepoEntity = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number = 0,
    limit: number = 10,
  ) {
    let orderObj: any = {};
    orderObj[sortBy] = sortDirection;

    let count = await this.postsRepo.count({ where: { blogId: blogId } });
    let posts = await this.postsRepo.find({
      where: { blogId: blogId },
      select: [],
      order: orderObj,
      skip: skip,
      take: limit,
    });
    //TODO добавить селект имени блога
    return { count, posts };
  }

  public async Create(
    postData: PostCreateEntity | PostWithExpectedBlogIdCreateEntity,
    blogId?: string,
  ): Promise<PostRepoEntity> {
    let blogId_num = +blogId;
    let post = PostRepoEntity.Init(postData, blogId_num);

    return await this.postsRepo.save(post);
  }

  public async DeleteAll() {
    let del = await this.postsRepo.delete({});
    return del.affected;
  }
}
