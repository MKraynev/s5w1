import { Module } from '@nestjs/common';
import { QuizQuestRepoModule } from 'src/repo/questions/questions.repo.module';
import { QuizQuestionsController } from './controller/quiz.questions.controller';
import { QuizQuestionsSaveUseCase } from './use-cases/quiz.questions.save.usecase';
import { CqrsModule } from '@nestjs/cqrs';

const QuizUseCases = [QuizQuestionsSaveUseCase];

@Module({
  imports: [CqrsModule, QuizQuestRepoModule],
  controllers: [QuizQuestionsController],
  providers: [...QuizUseCases],
})
export class QuizQuestionsModule {}
