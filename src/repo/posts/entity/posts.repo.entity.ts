import {
  PostCreateEntity,
  PostWithExpectedBlogIdCreateEntity,
} from 'src/features/superAdmin/controllers/entities/super.admin.create.post.entity';
import { BlogRepoEntity } from 'src/repo/blogs/entity/blogs.repo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => BlogRepoEntity, (blog) => blog.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  blog: BlogRepoEntity;
  @Column()
  blogId: number;

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
