import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
  ReadAccessToken,
  TokenExpectation,
} from 'src/auth/jwt/decorators/jwt.request.read.accessToken';
import { JwtServiceUserAccessTokenLoad } from 'src/auth/jwt/entities/jwt.service.accessTokenLoad';
import { PostsRepoService } from 'src/repo/posts/posts.repo.service';

@Controller('posts')
export class PostsController {
  constructor(private postRepo: PostsRepoService) {}
  @Get(':id')
  async GetPostById(
    @Param('id') id: string,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  ) {
    let post = await this.postRepo.ReadById(+id, true);

    if (post) return post;

    throw new NotFoundException();
  }
}
