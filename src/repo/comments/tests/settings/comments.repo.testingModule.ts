import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfiguration } from 'src/repo/users/tests/settings/users.repo.testingModule';

import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import { BlogRepoEntity } from 'src/repo/blogs/entity/blogs.repo.entity';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';
import { UsersRepoService } from 'src/repo/users/users.repo.service';

import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { BlogsRepoModule } from 'src/repo/blogs/blogs.repo.module';
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';
import { CommentRepoEntity } from '../../entities/commen.repo.entity';
import { LikeForPostRepoEntity } from 'src/repo/likes/postLikes/entity/like.for.posts.repo.entity';
import { LikeRepoService } from 'src/repo/likes/postLikes/likes.repo.service';
import { CommentsRepoService } from '../../comments.repo.service';
import { LikesRepoModule } from 'src/repo/likes/postLikes/likes.for.post.repo.module';

export const TestCommentsRepoTestingModule = Test.createTestingModule({
  imports: [
    testDbConfiguration,
    TypeOrmModule.forFeature([
      LikeForPostRepoEntity,
      UserRepoEntity,
      BlogRepoEntity,
      PostRepoEntity,
      CommentRepoEntity,
    ]),
    UsersRepoModule,
    BlogsRepoModule,
    PostsRepoModule,
    LikesRepoModule,
  ],
  providers: [
    BlogsRepoService,
    PostsRepoService,
    UsersRepoService,
    LikeRepoService,
    CommentsRepoService,
  ],
});
