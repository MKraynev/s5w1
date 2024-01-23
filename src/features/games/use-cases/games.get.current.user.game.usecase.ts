import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GamesRepoEntity } from 'src/repo/games/entities/games.repo.entity';
import { GamesRepoService } from 'src/repo/games/games.repo.service';

export class GamesGetCurrentUserGameCommand {
  constructor(public userId: string) {}
}
@CommandHandler(GamesGetCurrentUserGameCommand)
@Injectable()
export class GamesGetCurrentUserGameUseCase
  implements ICommandHandler<GamesGetCurrentUserGameCommand, GamesRepoEntity>
{
  constructor(private quizGameRepo: GamesRepoService) {}

  async execute(command: GamesGetCurrentUserGameCommand): Promise<GamesRepoEntity> {
    let game = await this.quizGameRepo.GetUserCurrentGame(command.userId);
    return game;
  }
}
