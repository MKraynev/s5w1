import { LikeForCommentRepoEntity } from "src/repo/likes/commentLikes/entity/like.for.comment.repo.entity";
import { PostRepoEntity } from "src/repo/posts/entity/posts.repo.entity";
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Comments')
export class CommentRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserRepoEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserRepoEntity;
  @Column()
  userId: number;

  @Column({ nullable: false })
  userLogin: string;

  @ManyToOne(() => PostRepoEntity, (post) => post.comments, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn()
  post: PostRepoEntity;
  @Column()
  postId: number;

  @OneToMany(()=> LikeForCommentRepoEntity, (like)=> like.comment)
  @JoinColumn()
  likes: LikeForCommentRepoEntity[]

  @Column({ nullable: false })
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public static Init(
    user: UserRepoEntity,
    post: PostRepoEntity,
    content: string,
  ) {
    let comment = new CommentRepoEntity();
    comment.user = user;
    comment.userId = user.id;
    comment.userLogin = user.login;

    comment.post = post;
    comment.postId = post.id;

    comment.content = content;

    return comment;
  }
}
