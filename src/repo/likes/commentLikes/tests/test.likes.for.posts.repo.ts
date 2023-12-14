import { TestingModule } from "@nestjs/testing";
import { BlogCreateEntity } from 'src/features/superAdmin/controllers/entities/super.admin.create.blog.entity';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { PostCreateEntity } from 'src/features/superAdmin/controllers/entities/super.admin.create.post.entity';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';
import { UsersRepoService } from 'src/repo/users/users.repo.service';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/users.controller.registration.entity';
import { TestLikesForPostsRepoTestingModule } from './settings/likes.for.posts.repo.testingModule';
import { PostRepoEntity } from "src/repo/posts/entity/posts.repo.entity";
import { LikeForPostRepoService } from "../../postLikes/likes.for.post.repo.service";

describe('Blogs test', () => {
  let module: TestingModule;

  let blogRepo: BlogsRepoService;
  let postRepo: PostsRepoService;
  let userRepo: UsersRepoService;
  let likeRepo: LikeForPostRepoService;

  beforeAll(async () => {
    module = await TestLikesForPostsRepoTestingModule.compile();

    await module.init();

    userRepo = module.get<UsersRepoService>(UsersRepoService);
    blogRepo = module.get<BlogsRepoService>(BlogsRepoService);
    postRepo = module.get<PostsRepoService>(PostsRepoService);
    likeRepo = module.get<LikeForPostRepoService>(LikeForPostRepoService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Like.SetUserLikeForPost() create 1 like', async () => {
    await blogRepo.DeleteAll();
    await postRepo.DeleteAll();
    await userRepo.DeleteAll();
    await likeRepo.DeleteAll();

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
    let createPost = await postRepo.Create(post, createdBlog.id.toString()) as PostRepoEntity;

    let userCreateData = new UserControllerRegistrationEntity(
      'somelogin',
      'someemail@mail.com',
      'somepass',
    );
    let user = await userRepo.Create(userCreateData, true);

    let savedLike = await likeRepo.SetUserLikeForPost(
      user.id.toString(),
      'Like',
      createPost.id.toString(),
    );

    let readAllLikes = await likeRepo.ReadAll();

    expect(readAllLikes.length).toEqual(1);
    expect(savedLike).toMatchObject(readAllLikes[0]);
  });

  // it('Blog.Create() id not exist => exception', async () => {
  //   await blogRepo.DeleteAll();
  //   let blog = new BlogCreateEntity(
  //     'blog name',
  //     'blog description',
  //     'someweb.com',
  //   );
  //   let createBlog = await blogRepo.Create(blog);

  //   expect(createBlog).toMatchObject(blog);
  // });

  // it('Blog.ReadManyByName()', async () => {
  //   await blogRepo.DeleteAll();
  //   await postRepo.DeleteAll();

  //   let blog = new BlogCreateEntity('blog', 'some desc', 'www.someurl.com');
  //   let blog2 = new BlogCreateEntity('blooooo', 'some desc', 'www.someurl.com');
  //   let blog3 = new BlogCreateEntity(
  //     'blllllll',
  //     'some desc',
  //     'www.someurl.com',
  //   );
  //   let blog4 = new BlogCreateEntity('zxczxc', 'some desc', 'www.someurl.com');

  //   let createdBlog = await blogRepo.Create(blog);
  //   let createdBlog2 = await blogRepo.Create(blog2);
  //   let createdBlog3 = await blogRepo.Create(blog3);
  //   let createdBlog4 = await blogRepo.Create(blog4);

  //   let readmany = await blogRepo.CountAndReadManyByName(
  //     'bl',
  //     'createdAt',
  //     'asc',
  //   );
  //   expect(readmany.count).toEqual(3);
  //   expect(readmany.blogs).toEqual([createdBlog, createdBlog2, createdBlog3]);
  // });
});
