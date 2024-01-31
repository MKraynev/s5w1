import { Test } from '@nestjs/testing';
import {
  TestUsersRepoTestingModule,
  testDbConfiguration,
} from 'src/repo/users/tests/settings/users.repo.testingModule';
import { PostsRepoModule } from 'src/repo/posts/posts.repo.module';
import { CommentRepoModule } from 'src/repo/comments/comments.repo.module';
import { LikesForPostRepoModule } from 'src/repo/likes/postLikes/likes.for.post.repo.module';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { PostUseCases } from '../../post.module';

export const TestUsersServiceTestingModule = Test.createTestingModule({
  imports: [testDbConfiguration, PostsRepoModule, CommentRepoModule, LikesForPostRepoModule, UsersRepoModule],
  providers: [...PostUseCases],
});
