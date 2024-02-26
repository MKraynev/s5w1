import { QuizGamePlayerInfoEntity } from './quiz.game.player.info.entity';
import { QuizGamePlayerProgressEntity } from './quiz.game.player.progress.entity';
import { QuizGameQuestionInfoEntity } from './quiz.game.question.info.entity';
import { QuizGameStatus } from './quiz.game.status.enum';

export class QuizGameGetMyCurrentEntity {
  constructor(
    public id: string,
    public firstPlayerProgress: QuizGamePlayerProgressEntity,
    public secondPlayerProgress: QuizGamePlayerProgressEntity,
    public questions: QuizGameQuestionInfoEntity[],
    public status: QuizGameStatus,
    public pairCreatedDate: Date,
    public startGameDate: Date,
    public finishGameDate: Date
  ) {}

  public static GetPendingForm(gameId: string, userId: string, userLogin: string, gameCreatedAt: Date) {
    let res = new QuizGameGetMyCurrentEntity(
      gameId,
      new QuizGamePlayerProgressEntity([], new QuizGamePlayerInfoEntity(userId, userLogin), 0),
      null,
      null,
      'PendingSecondPlayer',
      gameCreatedAt,
      null,
      null
    );

    return res;
  }
}
