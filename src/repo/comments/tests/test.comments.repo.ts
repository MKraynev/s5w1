import { TestingModule } from '@nestjs/testing';
import { BlogCreateEntity } from 'src/features/superAdmin/controllers/entities/super.admin.create.blog.entity';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { TestBlogsRepoTestingModule } from 'src/repo/blogs/tests/settings/blogs.repo.testingModule';
import { PostCreateEntity } from 'src/features/superAdmin/controllers/entities/super.admin.create.post.entity';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';
import { UsersRepoService } from 'src/repo/users/users.repo.service';
import { LikeRepoService } from 'src/repo/likes/postLikes/likes.repo.service';
import { TestCommentsRepoTestingModule } from './settings/comments.repo.testingModule';
import { CommentsRepoService } from '../comments.repo.service';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/users.controller.registration.entity';
import { CommentSetEntity } from 'src/features/posts/entities/post.controller.set.comment';

describe('CommentsRepo test', () => {
  let module: TestingModule;

  let blogRepo: BlogsRepoService;
  let postRepo: PostsRepoService;
  let userRepo: UsersRepoService;
  let likeRepo: LikeRepoService;
  let commentRepo: CommentsRepoService;

  beforeAll(async () => {
    module = await TestCommentsRepoTestingModule.compile();

    await module.init();

    userRepo = module.get<UsersRepoService>(UsersRepoService);
    blogRepo = module.get<BlogsRepoService>(BlogsRepoService);
    postRepo = module.get<PostsRepoService>(PostsRepoService);
    likeRepo = module.get<LikeRepoService>(LikeRepoService);
    commentRepo = module.get<CommentsRepoService>(CommentsRepoService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Comment.Create() create 1 comment', async () => {
    await blogRepo.DeleteAll();
    await postRepo.DeleteAll();
    await userRepo.DeleteAll();
    await likeRepo.DeleteAll();
    await commentRepo.DeleteAll();

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

    let userCreateData = new UserControllerRegistrationEntity(
      'somelogin',
      'someemail@mail.com',
      'somepass',
    );
    let user = await userRepo.Create(userCreateData, true);

    let comment = new CommentSetEntity();
    comment.content = 'some content for comment';

    let savedComment = await commentRepo.Create(
      comment,
      user.id.toString(),
      createPost.id.toString(),
    );

    let readAllComments = await commentRepo.ReadAll();

    expect(readAllComments.length).toEqual(1);
    expect(savedComment).toMatchObject(readAllComments[0]);

    // let savedLike = await likeRepo.SetUserLikeForPost(
    //   user.id,
    //   'Like',
    //   +createPost.id,
    // );

    // let readAllLikes = await likeRepo.ReadAll();

    // console.log('saved like', savedLike);
    // console.log('read all like', readAllLikes);

    // expect(readAllLikes.length).toEqual(1);
    // expect(savedLike).toMatchObject(readAllLikes[0]);
  });
});
