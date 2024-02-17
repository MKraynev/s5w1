import { Module } from '@nestjs/common';
import { QuizGameRepoModule } from 'src/repo/games/games.repo.module';
import { GamesPairGameQuizController } from './controllers/games.pair.game.quiz.controller';
import { QuizGameMyCurrentUseCase } from './use-cases/quiz.game.my.current.usecase';
import { CqrsModule } from '@nestjs/cqrs';

export const QuizGameUseCases = [QuizGameMyCurrentUseCase];

@Module({
  imports: [QuizGameRepoModule, CqrsModule],
  controllers: [GamesPairGameQuizController],
  providers: [...QuizGameUseCases],
  exports: [...QuizGameUseCases],
})
export class GamesModule {}
