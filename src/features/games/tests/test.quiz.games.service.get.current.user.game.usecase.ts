import { TestingModule } from '@nestjs/testing';
import { QuizGameMyCurrentCommand, QuizGameMyCurrentUseCase } from '../use-cases/quiz.game.my.current.usecase';
import { UsersRepoService } from 'src/repo/users/users.repo.service';
import { CommandBus } from '@nestjs/cqrs';
import { TestQuizGamesTestingModule } from './settings/quiz.game.service.testingModule';
import { GamesRepoService } from 'src/repo/games/games.repo.service';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/users.controller.registration.entity';
import { GamesRepoEntity } from 'src/repo/games/entities/games.repo.entity';
import { QuizGameAnswerRepoEntity } from 'src/repo/games/entities/games.answer.repo.entity';

describe(`${QuizGameMyCurrentUseCase.name} tests`, () => {
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
    await quizGameRepo.DeleteAll();

    let user = await userRepo.Create(new UserControllerRegistrationEntity('user', 'email@mail.com', '12345'), true);

    let savedGames = await quizGameRepo.CreateGame(user);

    let game = await commandBus.execute<QuizGameMyCurrentCommand, GamesRepoEntity>(
      new QuizGameMyCurrentCommand(user.id.toString())
    );
    console.log('repo res:', game);
    expect(game).toEqual({
      id: expect.any(Number),
      player_1_id: user.id,
      player_2_id: null,
      player_1_score: null,
      player_2_score: null,
      status: 'PendingSecondPlayer',
    });

    let rawGame = await quizGameRepo.dataSource.query(`
    SELECT id, player_1_id, player_2_id, player_1_score, player_2_score, status, "player1Id", "player2Id"
	  FROM public."Games"`);

    console.log('raw res:', rawGame);
  });
});
