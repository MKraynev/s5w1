import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/auth/guards/common/jwt-auth.guard';
import { ReadAccessToken } from 'src/auth/jwt/decorators/jwt.request.read.accessToken';
import { JwtServiceUserAccessTokenLoad } from 'src/auth/jwt/entities/jwt.service.accessTokenLoad';
import { QuizGameMyCurrentCommand } from '../use-cases/quiz.game.my.current.usecase';
import { GamesRepoEntity } from 'src/repo/games/entities/games.repo.entity';
import { QuizGameConnectToGameCommand } from '../use-cases/quiz.game.connect.to.game.usecase';
import { QuizGameInfo } from '../entities/QuizGameGetMyCurrent/_quiz.game.get.my.current.usecase.entity';

@Controller('pair-game-quiz')
export class GamesPairGameQuizController {
  constructor(private commandBus: CommandBus) {}
  @Get('pairs/my-current')
  @UseGuards(JwtAuthGuard)
  public async GetCurrentUserGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    let game = await this.commandBus.execute<QuizGameMyCurrentCommand, GamesRepoEntity>(
      new QuizGameMyCurrentCommand(tokenLoad.id)
    );

    return game;
  }

  @Post('pairs/connection')
  @UseGuards(JwtAuthGuard)
  public async ConnectToGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {
    let newGame = await this.commandBus.execute<QuizGameConnectToGameCommand, QuizGameInfo>(
      new QuizGameConnectToGameCommand(tokenLoad.id, tokenLoad.login)
    );

    return newGame;
  }
}
