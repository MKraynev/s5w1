import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { QuizGameRepoModule } from 'src/repo/games/games.repo.module';
import { GamesRepoService } from 'src/repo/games/games.repo.service';
import { testDbConfiguration } from 'src/repo/users/tests/settings/users.repo.testingModule';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { QuizGameUseCases } from '../../games.module';
import { LikesForPostRepoModule } from 'src/repo/likes/postLikes/likes.for.post.repo.module';
import { LikesForCommentRepoModule } from 'src/repo/likes/commentLikes/likes.for.comment.repo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForCommentRepoEntity } from 'src/repo/likes/commentLikes/entity/like.for.comment.repo.entity';
import { CommentRepoModule } from 'src/repo/comments/comments.repo.module';
import { QuizQuestRepoModule } from 'src/repo/questions/questions.repo.module';

export const TestQuizGamesTestingModule = Test.createTestingModule({
  imports: [
    testDbConfiguration,
    UsersRepoModule,
    CqrsModule,
    QuizGameRepoModule,
    LikesForPostRepoModule,
    LikesForCommentRepoModule,
    CommentRepoModule,
    QuizQuestRepoModule,
    TypeOrmModule.forFeature([LikeForCommentRepoEntity]),
  ],
  providers: [...QuizGameUseCases],
});
