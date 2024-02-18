import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GamesRepoEntity } from './entities/games.repo.entity';
import { UserRepoEntity } from '../users/entities/users.repo.entity';
import { QuizGameGetMyCurrentEntity } from 'src/features/games/entities/QuizGameGetMyCurrent/_quiz.game.get.my.current.usecase.entity';

export class GamesRepoService {
  constructor(
    @InjectRepository(GamesRepoEntity)
    private repo: Repository<GamesRepoEntity>,
    @InjectDataSource() public dataSource: DataSource
  ) {}

  public async CreateGame(hostPlayer: UserRepoEntity) {
    //TODO сделать создание игры
    let game = GamesRepoEntity.Init(hostPlayer);
    let savedGame = await this.repo.save(game);
    return savedGame;
  }
  public async GetUserCurrentGame(userId: string): Promise<QuizGameGetMyCurrentEntity> {
    let userId_num = +userId;
    let result: QuizGameGetMyCurrentEntity;

    let gameInfo = await this.repo
      .createQueryBuilder('game')
      .where('game.player_1_id = :id OR game.player_2_id = :id', { id: userId_num })
      .andWhere('game.status = Active OR game.status = PendingSecondPlayer')
      .getOneOrFail();

    let playersInfo = await this.dataSource.query(`
    SELECT id, login
    FROM public."Users"
    WHERE id = ${gameInfo.player_1_id} OR id= ${gameInfo.player_2_id}`);
    return result;

    let questionsInfo = await this.dataSource.query(`
    SELECT `);
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
