import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ValidateParameters } from 'src/common/pipes/validation.pipe';
import { QuizQuestionPostEntity } from './entities/questions.controller.post.entity';
import { CommandBus } from '@nestjs/cqrs';
import { QuizQuestionsSaveCommand } from '../use-cases/quiz.questions.save.usecase';
import { QuizQuestionEntity } from 'src/repo/questions/entity/questions.repo.entity';
import { SuperAdminGuard } from 'src/auth/guards/admin/guard.admin';

@Controller('sa/quiz')
@UseGuards(SuperAdminGuard)
export class QuizQuestionsController {
  constructor(private commandBus: CommandBus) {}

  @Post('questions')
  async CreatePost(@Body(new ValidateParameters()) questionData: QuizQuestionPostEntity) {
    let savedQuestion = await this.commandBus.execute<QuizQuestionsSaveCommand, QuizQuestionEntity>(
      new QuizQuestionsSaveCommand(questionData)
    );

    return savedQuestion;
  }
}
