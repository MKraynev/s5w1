import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/auth/guards/common/jwt-auth.guard';
import { ReadAccessToken } from 'src/auth/jwt/decorators/jwt.request.read.accessToken';
import { JwtServiceUserAccessTokenLoad } from 'src/auth/jwt/entities/jwt.service.accessTokenLoad';

@Controller('pair-game-quiz')
export class GamesPairGameQuizController {
  constructor(commandBus: CommandBus) {}
  @Get('pairs/my-current')
  @UseGuards(JwtAuthGuard)
  public async GetCurrentUserGame(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad) {}
}
