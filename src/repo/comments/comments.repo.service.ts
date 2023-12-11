import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from 'typeorm';
import { CommentRepoEntity } from './entities/commen.repo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentSetEntity } from 'src/features/posts/entities/post.controller.set.comment';
import { UserRepoEntity } from '../users/entities/users.repo.entity';
import { PostRepoEntity } from '../posts/entity/posts.repo.entity';
import { UsersRepoService } from '../users/users.repo.service';
import { PostsRepoService } from '../posts/posts.repo.service';

@Injectable()
export class CommentsRepoService {
  /**
   *
   */
  constructor(
    @InjectRepository(CommentRepoEntity)
    private commentRepo: Repository<CommentRepoEntity>,
    private userRepoService: UsersRepoService,
    private postRepoService: PostsRepoService,
  ) {}

  public async Create(
    user: UserRepoEntity,
    post: PostRepoEntity,
    commentData: CommentSetEntity,
  ) {
    let comment = CommentRepoEntity.Init(user, post, commentData.content);

    return await this.commentRepo.save(comment);
  }



  // public async UpdateById(
  //   commentId: string,
  //   commentData: CommentSetEntity,
  // ) {
  //   let comment = await this.commentRepo.findOneBy({ id: +commentId });

  //   if (!comment) return null;

  //   comment.name = blogData.name;
  //   comment.description = blogData.description;
  //   comment.websiteUrl = blogData.websiteUrl;

  //   let savedBlog = await this.blogsRepo.save(comment);

  //   if (format) return new BlogGetResultEntity(savedBlog);

  //   return savedBlog;
  // }

  public Update = async (comment: CommentRepoEntity) => await this.commentRepo.save(comment);

  public ReadOneById = async (id:string) => await this.commentRepo.findOne({where: {id: +id}, relations: {user: true}})

  public ReadAll = async () => await this.commentRepo.find({});

  public DeleteAll = async () => (await this.commentRepo.delete({})).affected;

  public DeleteById = async (id: string) => (await this.commentRepo.delete({id: +id})).affected;
}
