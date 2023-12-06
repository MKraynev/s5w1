import { Injectable, NotFoundException } from '@nestjs/common';
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
    commentData: CommentSetEntity,
    userId: string,
    postId: string,
  ) {
    let user = await this.userRepoService.ReadOneById(userId);
    if (!user) throw new NotFoundException();

    let post = (await this.postRepoService.ReadById(+postId)) as PostRepoEntity;
    if (!post) throw new NotFoundException();

    let comment = CommentRepoEntity.Init(user, post, commentData.content);

    return await this.commentRepo.save(comment);
  }

  public ReadAll = async () => await this.commentRepo.find({});

  public DeleteAll = async () => (await this.commentRepo.delete({})).affected;
}
