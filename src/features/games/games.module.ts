import { Module } from '@nestjs/common';
import { QuizGameRepoModule } from 'src/repo/games/games.repo.module';
import { GamesPairGameQuizController } from './controllers/games.pair.game.quiz.controller';
import { GamesGetCurrentUserGameUseCase } from './use-cases/games.get.current.user.game.usecase';
import { CqrsModule } from '@nestjs/cqrs';

export const QuizGameUseCases = [GamesGetCurrentUserGameUseCase];

@Module({
  imports: [QuizGameRepoModule, CqrsModule],
  controllers: [GamesPairGameQuizController],
  providers: [...QuizGameUseCases],
})
export class GamesModule {}
