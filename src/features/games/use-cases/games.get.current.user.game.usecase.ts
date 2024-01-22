import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class GamesGetCurrentUserGameCommand {
  constructor(userId: string) {}
}
@CommandHandler(GamesGetCurrentUserGameCommand)
@Injectable()
export class GamesGetCurrentUserGameUseCase implements ICommandHandler<GamesGetCurrentUserGameCommand, boolean> {
  /**
   *
   */
  constructor() {}
  execute(command: GamesGetCurrentUserGameCommand): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
