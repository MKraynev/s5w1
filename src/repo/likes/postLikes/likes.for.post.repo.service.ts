import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {
  AvailableLikeStatus,
  LikeForPostRepoEntity,
} from './entity/like.for.posts.repo.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { UsersRepoService } from '../../users/users.repo.service';
import { PostsRepoService } from '../../posts/posts.repo.service';
import { UserRepoEntity } from '../../users/entities/users.repo.entity';
import { PostRepoEntity } from '../../posts/entity/posts.repo.entity';

export type AvailableLikeTarget = 'post' | 'comment';

@Injectable()
export class LikeForPostRepoService {
  constructor(
    @InjectRepository(LikeForPostRepoEntity)
    private postLikes: Repository<LikeForPostRepoEntity>,
    private userRepo: UsersRepoService,
    private postRepo: PostsRepoService,
  ) {}

  public async SetUserLikeForPost(
    userId: string,
    userStatus: AvailableLikeStatus,
    postId: string,
  ) {
    let postId_num = +postId;
    let userId_num = +userId;

    if(Number.isNaN(postId_num) || Number.isNaN(userId_num))
      throw new ForbiddenException()

    let userLike = await this.postLikes.findOne({
      where: { userId: userId_num, postId: postId_num },
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

  public async GetUserStatus(
    postId: string,
    userId: string,
  ): Promise<AvailableLikeStatus> {
    let result: AvailableLikeStatus = 'None';

    let postId_num = +postId;
    let userId_num = +userId;

    if(Number.isNaN(userId_num) || Number.isNaN(postId_num))
      return result;

    let like = await this.postLikes.findOne({
      where: {
        postId: postId_num,
        userId: userId_num,
      },
    });

    if (like)
      return like.status;
    

    return result;
  }

  // public async GetUserLike(postId: string,
  //   userId: string,){
  //     let likeNum = +userId;
  //     if(!likeNum)
  //       return null;

  //   let like = await this.postLikes.findOne({
  //     where: {
  //       id: +postId,
  //       userId: +userId,
  //     },
  //   });

  //   return like;
  // }

  public async ReadMany(
    postId: string, 
    sortBy: keyof LikeForPostRepoEntity = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number = 0,
    limit: number = 10,){
      
      let orderObj: FindOptionsOrder<LikeForPostRepoEntity> = {};
    orderObj[sortBy] = sortDirection;

    
    let likes = await this.postLikes.find({
      where: {postId: +postId},
      order: orderObj,
      skip: skip,
      take: limit,
      relations: {user: true
      }
    });

    return likes;
    }

    public async Count(postId: string){
      
      let likes =  await this.postLikes.count({where: {postId: +postId, status: 'Like'}})
      let dislikes = await this.postLikes.count({where: {postId: +postId, status: "Dislike"}})

      return {likes, dislikes};
    }
}
