import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GamesRepoEntity } from 'src/repo/games/entities/games.repo.entity';
import { GamesRepoService } from 'src/repo/games/games.repo.service';
import { QuizGameGetMyCurrentEntity } from '../entities/QuizGameGetMyCurrent/_quiz.game.get.my.current.usecase.entity';

export class QuizGameMyCurrentCommand {
  constructor(public userId: string) {}
}
@CommandHandler(QuizGameMyCurrentCommand)
@Injectable()
export class QuizGameMyCurrentUseCase implements ICommandHandler<QuizGameMyCurrentCommand, QuizGameGetMyCurrentEntity> {
  constructor(private quizGameRepo: GamesRepoService) {}

  async execute(command: QuizGameMyCurrentCommand): Promise<QuizGameGetMyCurrentEntity> {
    let gameinfo = await this.quizGameRepo.GetUserCurrentGame(command.userId);

    let currentGame: QuizGameGetMyCurrentEntity;
    console.log(gameinfo);
    return currentGame;
  }
}
