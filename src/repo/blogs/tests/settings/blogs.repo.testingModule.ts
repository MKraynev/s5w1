import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfiguration } from 'src/repo/users/tests/settings/users.repo.testingModule';
import { BlogRepoEntity } from '../../entity/blogs.repo.entity';
import { Test } from '@nestjs/testing';
import { BlogsRepoService } from '../../blogs.repo.service';
import { PostRepoEntity } from 'src/repo/posts/entity/posts.repo.entity';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';

export const TestBlogsRepoTestingModule = Test.createTestingModule({
  imports: [
    testDbConfiguration,
    TypeOrmModule.forFeature([BlogRepoEntity, PostRepoEntity]),
  ],
  providers: [BlogsRepoService, PostsRepoService],
});
