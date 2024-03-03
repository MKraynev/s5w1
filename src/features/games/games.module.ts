import { Module } from '@nestjs/common';
import { QuizGameRepoModule } from 'src/repo/games/games.repo.module';
import { GamesPairGameQuizController } from './controllers/games.pair.game.quiz.controller';
import { QuizGameMyCurrentUseCase } from './use-cases/quiz.game.my.current.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { QuizGameQuestionsModule } from 'src/repo/QuizGameQuestions/quiz.game.questions.repo.module';
import { QuizGameConnectToGameUseCase } from './use-cases/quiz.game.connect.to.game.usecase';

export const QuizGameUseCases = [QuizGameMyCurrentUseCase, QuizGameConnectToGameUseCase];

@Module({
  imports: [QuizGameRepoModule, UsersRepoModule, QuizGameQuestionsModule, CqrsModule],
  controllers: [GamesPairGameQuizController],
  providers: [...QuizGameUseCases],
  exports: [...QuizGameUseCases],
})
export class GamesModule {}
