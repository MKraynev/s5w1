import { TestingModule } from '@nestjs/testing';
import {
  GamesGetCurrentUserGameCommand,
  GamesGetCurrentUserGameUseCase,
} from '../use-cases/games.get.current.user.game.usecase';
import { UsersRepoService } from 'src/repo/users/users.repo.service';
import { CommandBus } from '@nestjs/cqrs';
import { TestQuizGamesTestingModule } from './settings/quiz.game.service.testingModule';
import { GamesRepoService } from 'src/repo/games/games.repo.service';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/users.controller.registration.entity';
import { GamesRepoEntity } from 'src/repo/games/entities/games.repo.entity';

describe(`${GamesGetCurrentUserGameUseCase.name} tests`, () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  let userRepo: UsersRepoService;
  let quizGameRepo: GamesRepoService;

  beforeAll(async () => {
    module = await TestQuizGamesTestingModule.compile();

    await module.init();

    userRepo = module.get<UsersRepoService>(UsersRepoService);
    commandBus = module.get<CommandBus>(CommandBus);
    quizGameRepo = module.get<GamesRepoService>(GamesRepoService);
  });

  it('Return created game by user.id', async () => {
    let user = await userRepo.Create(new UserControllerRegistrationEntity('user', 'email@mail.com', '12345'), true);

    let savedGames = await quizGameRepo.CreateGame(user);

    let game = await commandBus.execute<GamesGetCurrentUserGameCommand, GamesRepoEntity>(
      new GamesGetCurrentUserGameCommand(user.id.toString())
    );

    expect(game).toEqual({
      id: expect.any(Number),
      player_1_id: expect.any(Number),
      player_2_id: null,
      player_1_score: null,
      player_2_score: null,
      status: 'PendingSecondPlayer',
    });
  });
});
