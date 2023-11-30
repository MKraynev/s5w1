import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
