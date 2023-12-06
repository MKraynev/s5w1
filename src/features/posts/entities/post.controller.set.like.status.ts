import { IsEnum } from 'class-validator';
import {
  AvailableLikeStatus,
  AvailableLikeStatusArray,
} from 'src/repo/likes/postLikes/entity/like.for.posts.repo.entity';

export class LikeSetEntity {
  @IsEnum(AvailableLikeStatusArray)
  public likeStatus: AvailableLikeStatus;

  //   constructor(status: AvailableLikeStatus) {
  //     this.likeStatus = status;
  //   }
}
