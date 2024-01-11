import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ValidateParameters } from 'src/common/pipes/validation.pipe';
import { QuizQuestionPostEntity } from './entities/questions.controller.post.entity';
import { CommandBus } from '@nestjs/cqrs';
import { QuizQuestionsSaveCommand } from '../use-cases/quiz.questions.save.usecase';
import { QuizQuestionEntity } from 'src/repo/questions/entity/questions.repo.entity';
import { SuperAdminGuard } from 'src/auth/guards/admin/guard.admin';
import { QuizQuestionRepoService } from 'src/repo/questions/questions.repo.service';

@Controller('sa/quiz')
@UseGuards(SuperAdminGuard)
export class QuizQuestionsController {
  constructor(
    private commandBus: CommandBus,
    private quizRepo: QuizQuestionRepoService
  ) {}

  @Post('questions')
  async Create(@Body(new ValidateParameters()) questionData: QuizQuestionPostEntity) {
    let savedQuestion = await this.commandBus.execute<QuizQuestionsSaveCommand, QuizQuestionEntity>(
      new QuizQuestionsSaveCommand(questionData)
    );

    return savedQuestion;
  }

  @Delete('questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async Delete(@Param('id') id: string) {
    let delCount = await this.quizRepo.DeleteById(id);

    if (delCount === 1) return;

    throw new NotFoundException();
  }
}
