import { Controller, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { SuperAdminGuard } from 'src/auth/guards/admin/guard.admin';
import { BlogsRepoService } from 'src/repo/blogs/blogs.repo.service';
import { CommentsRepoService } from 'src/repo/comments/comments.repo.service';
import { DeviceRepoService } from 'src/repo/devices/devices.repo.service';
import { LikeForCommentRepoService } from 'src/repo/likes/commentLikes/likes.for.comment.repo.service';
import { LikeForPostRepoService } from 'src/repo/likes/postLikes/likes.for.post.repo.service';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';
import { UsersRepoService } from 'src/repo/users/users.repo.service';

// @UseGuards(AdminGuard)
@Controller('testing/all-data')
export class AdminTestingController {
  constructor(
    private userRepo: UsersRepoService,
    private deviceRepo: DeviceRepoService,
    private blogRepo: BlogsRepoService,
    private postRepo: PostsRepoService,
    private commentRepo: CommentsRepoService,
    private likeForPost: LikeForPostRepoService,
    private likeForComments: LikeForCommentRepoService
  ) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteAll() {
    await this.blogRepo.DeleteAll();
    await this.userRepo.DeleteAll();
    await this.postRepo.DeleteAll();
    await this.commentRepo.DeleteAll();
    await this.likeForPost.DeleteAll();
    await this.likeForComments.DeleteAll();
    await this.deviceRepo.DeleteAll();

    return;
  }
}
