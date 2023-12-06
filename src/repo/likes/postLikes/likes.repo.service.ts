import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AvailableLikeStatus,
  LikeForPostRepoEntity,
} from './entity/like.for.posts.repo.entity';
import { Repository } from 'typeorm';
import { UsersRepoService } from '../../users/users.repo.service';
import { PostsRepoService } from '../../posts/posts.repo.service';
import { UserRepoEntity } from '../../users/entities/users.repo.entity';
import { PostRepoEntity } from '../../posts/entity/posts.repo.entity';

export type AvailableLikeTarget = 'post' | 'comment';

@Injectable()
export class LikeRepoService {
  constructor(
    @InjectRepository(LikeForPostRepoEntity)
    private postLikes: Repository<LikeForPostRepoEntity>,
    private userRepo: UsersRepoService,
    private postRepo: PostsRepoService,
  ) {}

  public async SetUserLikeForPost(
    userId: number,
    userStatus: AvailableLikeStatus,
    postId: number,
  ) {
    let userLike = await this.postLikes.findOne({
      where: { userId: userId },
    });

    if (userLike) {
      //like exist
      userLike.status = userStatus;
    } else {
      let user = await this.userRepo.ReadOneById(userId.toString());
      if (!user) throw new NotFoundException();

      let post = (await this.postRepo.ReadById(postId)) as PostRepoEntity;
      if (!post) throw new NotFoundException();

      userLike = LikeForPostRepoEntity.Init(userStatus, post, user);
    }
    return await this.postLikes.save(userLike);
  }

  public async ReadAll() {
    return await this.postLikes.find({});
  }
  public async DeleteAll() {
    return (await this.postLikes.delete({})).affected;
  }
}
