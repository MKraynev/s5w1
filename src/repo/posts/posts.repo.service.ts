import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PostRepoEntity } from './entity/posts.repo.entity';
import {
  PostCreateEntity,
  PostWithExpectedBlogIdCreateEntity,
} from 'src/features/superAdmin/controllers/entities/super.admin.create.post.entity';
import { PostGetResultEntity } from 'src/features/posts/entities/posts.controller.get.result.entity';

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
    format: boolean = false,
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
      relations: { blog: true },
    });
    if (format) {
      let formatedPosts = posts.map((post) => {
        let fpost = new PostGetResultEntity(post);
        fpost.InitLikes();
        return fpost;
      });

      return { count, posts: formatedPosts };
    }

    //TODO добавить селект имени блога
    return { count, posts };
  }

  public async Create(
    postData: PostCreateEntity | PostWithExpectedBlogIdCreateEntity,
    blogId: string,
    format: boolean = false,
  ): Promise<PostRepoEntity | PostGetResultEntity> {
    let blogId_num = +blogId;
    let post = PostRepoEntity.Init(postData, blogId_num);

    let savedPost = await this.postsRepo.save(post);
    let fulfieldPost = await this.postsRepo.findOne({
      where: { id: savedPost.id },
      relations: { blog: true },
    });

    if (format) {
      let fpost = new PostGetResultEntity(fulfieldPost);
      fpost.InitLikes();
      return fpost;
    }
    return fulfieldPost;
  }

  public async DeleteAll() {
    let del = await this.postsRepo.delete({});
    return del.affected;
  }

  public async ReadById(id: number, format: boolean = false) {
    let post = await this.postsRepo.findOne({
      where: { id: id },
      relations: { blog: true },
    });

    if (format && post) {
      let fpost = new PostGetResultEntity(post);
      return fpost;
    }
    return post;
  }

  public async UpdateOne(
    postId: number,
    blogId: number,
    postData: PostCreateEntity,
    format: boolean = false,
  ) {
    let post = await this.postsRepo.findOne({
      where: { id: postId, blogId: blogId },
    });

    if (!post) return null;

    post.content = postData.content;
    post.shortDescription = postData.shortDescription;
    post.title = postData.title;

    let savedPost = await this.postsRepo.save(post);

    return savedPost;
  }
}
