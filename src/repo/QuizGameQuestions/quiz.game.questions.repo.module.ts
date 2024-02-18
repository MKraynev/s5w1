import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizGameQuestionRepoEntity } from './entity/quiz.game.question.repo.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([QuizGameQuestionRepoEntity])],
})
export class QuizGameQuestionsModule {}
