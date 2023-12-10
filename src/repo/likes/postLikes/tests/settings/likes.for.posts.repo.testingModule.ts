import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfiguration } from 'src/repo/users/tests/settings/users.repo.testingModule';
import { LikeForPostRepoEntity } from '../../entity/like.for.posts.repo.entity';
import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import { BlogRepoEntity } from 'src/repo/blogs/entity/blogs.repo.entity';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';
import { UsersRepoService } from 'src/repo/users/users.repo.service';
import { LikeForPostRepoService } from '../../likes.for.post.repo.service';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { BlogsRepoModule } from 'src/repo/blogs/blogs.repo.module';
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';

export const TestLikesForPostsRepoTestingModule = Test.createTestingModule({
  imports: [
    testDbConfiguration,

    TypeOrmModule.forFeature([
      LikeForPostRepoEntity,
      UserRepoEntity,
      BlogRepoEntity,
      PostRepoEntity,
    ]),
    UsersRepoModule,
    BlogsRepoModule,
    PostsRepoModule,
  ],
  providers: [
    BlogsRepoService,
    PostsRepoService,
    UsersRepoService,
    LikeForPostRepoService,
  ],
});
