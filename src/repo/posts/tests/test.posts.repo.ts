import { TestingModule } from '@nestjs/testing';
import { BlogCreateEntity } from 'src/features/superAdmin/controllers/entities/super.admin.create.blog.entity';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { PostsRepoService } from '../posts.repo.service';
import { TestBlogsRepoTestingModule } from 'src/repo/blogs/tests/settings/blogs.repo.testingModule';
import { PostCreateEntity } from 'src/features/superAdmin/controllers/entities/super.admin.create.post.entity';

describe('Blogs test', () => {
  let module: TestingModule;

  let blogRepo: BlogsRepoService;
  let postRepo: PostsRepoService;

  beforeAll(async () => {
    module = await TestBlogsRepoTestingModule.compile();

    await module.init();

    blogRepo = module.get<BlogsRepoService>(BlogsRepoService);
    postRepo = module.get<PostsRepoService>(PostsRepoService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Post.Create()', async () => {
    await blogRepo.DeleteAll();
    await postRepo.DeleteAll();

    let blog = new BlogCreateEntity(
      'some blog',
      'some desc',
      'www.someurl.com',
    );

    let createdBlog = await blogRepo.Create(blog);
    expect(createdBlog).toMatchObject(blog);

    let post = new PostCreateEntity(
      'some title',
      'some short',
      'some content lorem lorem lorem lorem lorem lorem',
    );
    let createPost = await postRepo.Create(post, createdBlog.id.toString());
    expect(createPost).toMatchObject(post);
  });

  // it('Post.Create() id not exist => exception', async () => {
  //   await blogRepo.DeleteAll();
  //   await postRepo.DeleteAll();

  //   let post = new PostCreateEntity(
  //     'some title',
  //     'some short',
  //     'some content lorem lorem lorem lorem lorem lorem',
  //   );
  //   let createPost = await postRepo.Create(post, '123321123');
  //   expect(createPost).toBeUndefined();
  // });
});
