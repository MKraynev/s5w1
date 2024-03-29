import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QuizGameQuestionsExtendedInfoEntity } from '../games/entities/quiz.game.questions.extended.info.entity';

export class QuizGameToQuestionsRepoService {
  constructor(@InjectDataSource() public dataSource: DataSource) {}

  public async GetGameQuestionsInfoOrdered(
    gameId: string | number,
    user_1_id: string | number,
    user_2_id: string | number
  ) {
    let questionsInfo = (await this.dataSource.query(`
    SELECT m."questionId", q."body" question, q."correctAnswers" answer, m."orderNum", m."p1_answer", m."p1_answer_time", m."p2_answer", m."p2_answer_time"
    FROM public."QuizQuestions" q
    RIGHT JOIN (
      SELECT m1.*, a2."answer" p2_answer, a2."createdAt" p2_answer_time
      FROM public."Answers" a2
      RIGHT JOIN (
        SELECT qq."gameId", qq."questionId", qq."orderNum", a1."answer" p1_answer, a1."createdAt" p1_answer_time
        FROM public."QuizGameQuestion" qq
        LEFT JOIN public."Answers" a1
        ON qq."questionId" = a1."questionId" AND qq."gameId" = ${gameId} AND a1."userId" = ${user_1_id}
      ) as m1
      ON a2."questionId" = m1."questionId" AND a2."userId" = ${user_2_id}
    ) m
    ON m."questionId" = q."id"
    ORDER BY m."orderNum" ASC;
    `)) as QuizGameQuestionsExtendedInfoEntity[];

    return questionsInfo;
  }
}
