import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRepoService } from '../../users/users.repo.service';
import { LikeForCommentRepoEntity } from "./entity/like.for.comment.repo.entity";
import { AvailableLikeStatus } from "../postLikes/entity/like.for.posts.repo.entity";
import { CommentsRepoService } from "src/repo/comments/comments.repo.service";
import { CommentRepoEntity } from "src/repo/comments/entities/commen.repo.entity";
import { UserRepoEntity } from "src/repo/users/entities/users.repo.entity";

@Injectable()
export class LikeForCommentRepoService {
  constructor(
    @InjectRepository(LikeForCommentRepoEntity)
    private commentLikes: Repository<LikeForCommentRepoEntity>,
  ) {}

  public async SetUserLikeForComment(
    user: UserRepoEntity,
    userStatus: AvailableLikeStatus,
    comment: CommentRepoEntity
  ) {
    let userLike = await this.commentLikes.findOne({
      where: { userId: user.id },
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

  public async GetUserStatus(
    commentId: string,
    userId?: string,
  ): Promise<AvailableLikeStatus> {
    if(!userId)
      return 'None'


    let like = await this.commentLikes.findOne({
      where: {
        id: +commentId,
        userId: +userId,
      },
    });

    return like?.status || 'None';
  }

  public async GetStatistic(commentId: string){
    let likeCount = await this.commentLikes.count({where: {
      commentId: +commentId,
      status: 'Like'
    }})

    let dislikeCount = await this.commentLikes.count({where: {
      commentId: +commentId,
      status: 'Dislike'
    }})

    return {like: likeCount, dislike: dislikeCount}
  }
}
