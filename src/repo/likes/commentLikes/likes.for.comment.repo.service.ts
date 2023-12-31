import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { UsersRepoService } from '../../users/users.repo.service';
import { LikeForCommentRepoEntity } from './entity/like.for.comment.repo.entity';
import { AvailableLikeStatus } from '../postLikes/entity/like.for.posts.repo.entity';
import { CommentsRepoService } from 'src/repo/comments/comments.repo.service';
import { CommentRepoEntity } from 'src/repo/comments/entities/commen.repo.entity';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';

@Injectable()
export class LikeForCommentRepoService {
  constructor(
    @InjectRepository(LikeForCommentRepoEntity)
    private commentLikes: Repository<LikeForCommentRepoEntity>
  ) {}

  public async SetUserLikeForComment(
    user: UserRepoEntity,
    userStatus: AvailableLikeStatus,
    comment: CommentRepoEntity
  ) {
    let userLike = await this.commentLikes.findOne({
      where: { userId: user.id, commentId: comment.id },
    });

    if (userLike) {
      //like exist
      userLike.status = userStatus;
    } else {
      userLike = LikeForCommentRepoEntity.Init(userStatus, comment, user);
    }
    return await this.commentLikes.save(userLike);
  }

  public async ReadAll() {
    return await this.commentLikes.find({});
  }
  public async DeleteAll() {
    return (await this.commentLikes.delete({})).affected;
  }

  public async GetUserStatus(commentId: string, userId?: string): Promise<AvailableLikeStatus> {
    let result: AvailableLikeStatus = 'None';

    let commentId_num = +commentId;
    let userId_num = +userId;

    if (Number.isNaN(userId_num) || Number.isNaN(commentId_num)) return result;

    let like = await this.commentLikes.findOne({
      where: {
        commentId: commentId_num,
        userId: userId_num,
      },
    });

    if (like) return like.status;

    return result;
  }

  public async GetStatistic(commentId: string) {
    let likeCount = await this.commentLikes.count({
      where: {
        commentId: +commentId,
        status: 'Like',
      },
    });

    let dislikeCount = await this.commentLikes.count({
      where: {
        commentId: +commentId,
        status: 'Dislike',
      },
    });

    return { like: likeCount, dislike: dislikeCount };
  }

  public async ReadManyLikes(
    commentId: string,
    sortBy: keyof LikeForCommentRepoEntity = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number = 0,
    limit: number = 10
  ) {
    let orderObj: FindOptionsOrder<LikeForCommentRepoEntity> = {};
    orderObj[sortBy] = sortDirection;

    let likes = await this.commentLikes.find({
      where: { commentId: +commentId, status: 'Like' },
      order: orderObj,
      skip: skip,
      take: limit,
      relations: { user: true },
    });

    return likes;
  }
}
