import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GamesRepoEntity } from './entities/games.repo.entity';
import { UserRepoEntity } from '../users/entities/users.repo.entity';
import { QuizGameInfo } from 'src/features/games/entities/QuizGameGetMyCurrent/_quiz.game.get.my.current.usecase.entity';

export class GamesRepoService {
  constructor(
    @InjectRepository(GamesRepoEntity)
    private repo: Repository<GamesRepoEntity>,
    @InjectDataSource() public dataSource: DataSource
  ) {}

  public async CreateGame(userId: number) {
    //TODO сделать создание игры
    let game = GamesRepoEntity.Init(userId);
    let savedGame = await this.repo.save(game);
    return savedGame;
  }
  public async GetUserCurrentGame(userId: string): Promise<GamesRepoEntity> {
    let result: QuizGameInfo;

    let gameInfo = await this.repo
      .createQueryBuilder('game')
      .where('game.player_1_id = :id OR game.player_2_id = :id', { id: userId })
      .andWhere('game.status = :active OR game.status = :pending', { active: 'Active', pending: 'PendingSecondPlayer' })
      .getOneOrFail();

    return gameInfo;
  }

  public async GetSearchingGame(): Promise<GamesRepoEntity | null> {
    let game = await this.repo.findOne({
      where: { status: 'PendingSecondPlayer' },
    });

    return game;
  }

  public async DeleteAll() {
    await this.repo.delete({});
  }
}

// {
//   "id": "string",  -> GameRepo(user_1_id OR user_2_id) = game
//   "firstPlayerProgress": {
//     "answers": [                                          _
//       {                                                    |
//         "questionId": "string",                            |
//         "answerStatus": "Correct",                         | -> game.id -> answerRepo(user_1_id or user_2_id) -> answers.order by answer.number
//         "addedAt": "2024-02-17T09:14:25.036Z"              |
//       }__________________________________________________ _
//     ],
//     "player": {                                           _
//       "id": "string",                                      | -> game.user_1_id or user_2_id
//       "login": "string"                                    |
//     },                                                    _
//     "score": 0                                           взять из полученных ответов путем перебора
//   },
//   "secondPlayerProgress": {
//     "answers": [  --взято выше                           Х
//       {                                                  Х
//         "questionId": "string",                          Х
//         "answerStatus": "Correct",                       Х
//         "addedAt": "2024-02-17T09:14:25.037Z"            Х
//       }                                                  Х
//     ],                                                   Х
//     "player": {
//       "id": "string",
//       "login": "string"
//     },
//     "score": 0 взято из перебопа
//   },
//   "questions": [ --> questionForGame + QuizQuestion
//     {
//       "id": "string",
//       "body": "string"
//     }
//   ],
//   "status": "PendingSecondPlayer", -> GameRepo(user_1_id OR user_2_id) = game
//   "pairCreatedDate": "2024-02-17T09:14:25.037Z", -> GameRepo(user_1_id OR user_2_id) = game
//   "startGameDate": "2024-02-17T09:14:25.037Z",   -> GameRepo(user_1_id OR user_2_id) = game
//   "finishGameDate": "2024-02-17T09:14:25.037Z"   -> GameRepo(user_1_id OR user_2_id) = game
// }
