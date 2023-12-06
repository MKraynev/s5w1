import {
  PostCreateEntity,
  PostWithExpectedBlogIdCreateEntity,
} from 'src/features/superAdmin/controllers/entities/super.admin.create.post.entity';
import { BlogRepoEntity } from 'src/repo/blogs/entity/blogs.repo.entity';
import { CommentRepoEntity } from 'src/repo/comments/entities/commen.repo.entity';
import { LikeForPostRepoEntity } from 'src/repo/likes/postLikes/entity/like.for.posts.repo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Posts')
export class PostRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @OneToMany(() => CommentRepoEntity, (comment) => comment.post)
  @JoinColumn()
  comments: CommentRepoEntity[];

  @ManyToOne(() => BlogRepoEntity, (blog) => blog.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  blog: BlogRepoEntity;
  @Column()
  blogId: number;

  @OneToMany(() => LikeForPostRepoEntity, (like) => like.post)
  likes: LikeForPostRepoEntity[];

  @Column()
  blogName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public static Init(
    postData: PostCreateEntity | PostWithExpectedBlogIdCreateEntity,
    blogId?: number,
  ): PostRepoEntity {
    let post = new PostRepoEntity();
    post.title = postData.title;
    post.shortDescription = postData.shortDescription;
    post.content = postData.content;
    post.blogId = blogId;
    return post;
  }
}
