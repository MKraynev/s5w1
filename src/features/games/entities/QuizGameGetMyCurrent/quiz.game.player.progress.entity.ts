import { QuizGameAnswerInfoEntity } from './quiz.game.answer.info.entity';
import { QuizGamePlayerInfoEntity } from './quiz.game.player.info.entity';

export class QuizGamePlayerProgressEntity {
  constructor(
    public answers: QuizGameAnswerInfoEntity[],
    public player: QuizGamePlayerInfoEntity,
    public score: number
  ) {}
}
