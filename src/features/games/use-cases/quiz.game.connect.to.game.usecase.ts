import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizGameInfo } from '../entities/QuizGameGetMyCurrent/_quiz.game.get.my.current.usecase.entity';
import { GamesRepoService } from 'src/repo/games/games.repo.service';
import { GamesRepoEntity } from 'src/repo/games/entities/games.repo.entity';

export class QuizGameConnectToGameCommand {
  constructor(
    public userId: string,
    public userLogin: string
  ) {}
}

@CommandHandler(QuizGameConnectToGameCommand)
@Injectable()
export class QuizGameConnectToGameUseCase implements ICommandHandler<QuizGameConnectToGameCommand, QuizGameInfo> {
  constructor(private gameRepo: GamesRepoService) {}

  async execute(command: QuizGameConnectToGameCommand): Promise<QuizGameInfo> {
    let quizGame: QuizGameInfo;
    let gameCreated = false;
    let gameRepoEntity: GamesRepoEntity;

    gameRepoEntity = await this.gameRepo.GetSearchingGame();
    if (!gameRepoEntity) {
      gameRepoEntity = await this.gameRepo.CreateGame(+command.userId);

      quizGame = QuizGameInfo.GetPendingForm(
        gameRepoEntity.id.toString(),
        command.userId,
        command.userLogin,
        gameRepoEntity.createdAt
      );

      return quizGame;
    }

    return quizGame;
  }
}
