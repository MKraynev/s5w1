import { UserDevice } from "src/features/devices/use-cases/devices.service.get.users.devices.usecase";
import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AvailableLikeStatus = 'Like' | 'Dislike' | 'None';
export const AvailableLikeStatusArray: AvailableLikeStatus[] = [
  'Like',
  'Dislike',
  'None',
];

@Entity('LikesForPosts')
export class LikeForPostRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostRepoEntity, (post) => post.likes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: PostRepoEntity;
  @Column()
  postId: number;

  @ManyToOne(() => UserRepoEntity, (user) => user.likes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserRepoEntity;
  @Column()
  userId: number;

  @Column()
  status: AvailableLikeStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public static Init(
    status: AvailableLikeStatus,
    post: PostRepoEntity,
    user: UserRepoEntity,
  ) {
    let like = new LikeForPostRepoEntity();
    like.post = post;
    like.postId = post.id;

    like.user = user;
    like.userId = user.id;

    like.status = status;

    return like;
  }
}

