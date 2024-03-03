import { TestingModule } from '@nestjs/testing';
import { QuizGameMyCurrentCommand, QuizGameMyCurrentUseCase } from '../use-cases/quiz.game.my.current.usecase';
import { UsersRepoService } from 'src/repo/users/users.repo.service';
import { CommandBus } from '@nestjs/cqrs';
import { TestQuizGamesTestingModule } from './settings/quiz.game.service.testingModule';
import { GamesRepoService } from 'src/repo/games/games.repo.service';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/users.controller.registration.entity';
import { GamesRepoEntity } from 'src/repo/games/entities/games.repo.entity';
import { QuizGameAnswerRepoEntity } from 'src/repo/games/entities/games.answer.repo.entity';
import { QuizGameConnectToGameCommand } from '../use-cases/quiz.game.connect.to.game.usecase';
import { QuizGameInfo } from '../entities/QuizGameGetMyCurrent/_quiz.game.get.my.current.usecase.entity';

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

    let game = await commandBus.execute<QuizGameConnectToGameCommand, QuizGameInfo>(
      new QuizGameConnectToGameCommand(user.id.toString(), user.login)
    );

    expect(game).toEqual({});
  });
});
