import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizGameQuestionRepoEntity } from './entity/quiz.game.question.repo.entity';
import { Module } from '@nestjs/common';
import { QuizGameToQuestionsRepoService } from './quiz.game.questions.repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuizGameQuestionRepoEntity])],
  providers: [QuizGameToQuestionsRepoService],
  exports: [QuizGameToQuestionsRepoService],
})
export class QuizGameQuestionsModule {}
