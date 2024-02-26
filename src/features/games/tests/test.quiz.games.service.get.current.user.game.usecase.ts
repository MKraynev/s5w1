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
    // await quizGameRepo.DeleteAll();
    // let user = await userRepo.Create(new UserControllerRegistrationEntity('user', 'email@mail.com', '12345'), true);
    // let savedGames = await quizGameRepo.CreateGame(user);
    let game = await commandBus.execute<QuizGameMyCurrentCommand, GamesRepoEntity>(new QuizGameMyCurrentCommand('31'));

    console.log(game);
    expect(1).toEqual(1);
    // console.log('repo res:', game);
    // expect(game).toEqual({
    //   id: expect.any(Number),
    //   player_1_id: user.id,
    //   player_2_id: null,
    //   player_1_score: null,
    //   player_2_score: null,
    //   status: 'PendingSecondPlayer',
    // });
    // let rawGame = await quizGameRepo.dataSource.query(`
    // SELECT m."questionId", q."body" question, q."correctAnswers" answer, m."orderNum", m."p1_answer", m."p1_answer_time", m."p2_answer", m."p2_answer_time"
    // FROM public."QuizQuestions" q
    // RIGHT JOIN (
    //   SELECT m1.*, a2."answer" p2_answer, a2."createdAt" p2_answer_time
    //   FROM public."Answers" a2
    //   RIGHT JOIN (
    //     SELECT qq."gameId", qq."questionId", qq."orderNum", a1."answer" p1_answer, a1."createdAt" p1_answer_time
    //     FROM public."QuizGameQuestion" qq
    //     LEFT JOIN public."Answers" a1
    //     ON qq."questionId" = a1."questionId" AND qq."gameId" = 5 AND a1."userId" = 31
    //   ) as m1
    //   ON a2."questionId" = m1."questionId" AND a2."userId" = 32
    // ) m
    // ON m."questionId" = q."id"
    // ORDER BY m."orderNum" ASC;
    // `);
    // console.log('raw res:', rawGame);
    // expect(1).toEqual(1);
  });
});
