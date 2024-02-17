import { QuizGamePlayerProgressEntity } from './quiz.game.player.progress.entity';
import { QuizGameQuestionInfoEntity } from './quiz.game.question.info.entity';
import { QuizGameStatus } from './quiz.game.status.enum';

export class QuizGameGetMyCurrentEntity {
  public id: string;
  public firstPlayerProgress: QuizGamePlayerProgressEntity;
  public secondPlayerProgress: QuizGamePlayerProgressEntity;
  public questions: QuizGameQuestionInfoEntity[];
  public status: QuizGameStatus;
  public pairCreatedDate: Date;
  public startGameDate: Date;
  public finishGameDate: Date;
}
