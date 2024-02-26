import { QuizGameAnswerInfoEntity } from 'src/features/games/entities/QuizGameGetMyCurrent/quiz.game.answer.info.entity';
import { QuizGamePlayerProgressEntity } from 'src/features/games/entities/QuizGameGetMyCurrent/quiz.game.player.progress.entity';

export class QuizGameQuestionsExtendedInfoEntity {
  public questionId: number;
  public question: string;
  public answer: Array<string>;
  public orderNum: number;
  public p1_answer: string | null;
  public p1_answer_time: Date | null;
  public p2_answer: string | null;
  public p2_answer_time: Date | null;

  public static GetPlayersInfo(data: QuizGameQuestionsExtendedInfoEntity[]): {
    firstPlayerResult: QuizGameAnswerInfoEntity[];
    secondPlayerResult: QuizGameAnswerInfoEntity[];
  } {
    let result: {
      firstPlayerResult: QuizGameAnswerInfoEntity[];
      secondPlayerResult: QuizGameAnswerInfoEntity[];
    } = {
      firstPlayerResult: [],
      secondPlayerResult: [],
    };

    data.forEach((dataline) => {
      if (dataline.p1_answer) {
        let firstPlayerInfo = new QuizGameAnswerInfoEntity(
          dataline.questionId.toString(),
          dataline.answer,
          dataline.p1_answer,
          dataline.p1_answer_time
        );
        result.firstPlayerResult.push(firstPlayerInfo);
      }

      if (dataline.p2_answer) {
        let secondPlayerInfo = new QuizGameAnswerInfoEntity(
          dataline.questionId.toString(),
          dataline.answer,
          dataline.p2_answer,
          dataline.p2_answer_time
        );
        result.secondPlayerResult.push(secondPlayerInfo);
      }
    });

    return result;
  }
}
