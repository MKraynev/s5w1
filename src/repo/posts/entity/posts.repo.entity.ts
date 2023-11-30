import { BlogRepoEntity } from 'src/repo/blogs/entity/blogs.repo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
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
  blog: BlogRepoEntity;
  @Column()
  blogId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
