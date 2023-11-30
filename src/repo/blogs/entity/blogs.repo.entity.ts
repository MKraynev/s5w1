import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BlogRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  isMembership: boolean;

  @OneToMany(() => PostRepoEntity, (post) => post.blog)
  posts: PostRepoEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
