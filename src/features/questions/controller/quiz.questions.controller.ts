import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ValidateParameters } from 'src/common/pipes/validation.pipe';
import { QuizQuestionPostEntity } from './entities/questions.controller.post.entity';
import { CommandBus } from '@nestjs/cqrs';
import { QuizQuestionsSaveCommand } from '../use-cases/quiz.questions.save.usecase';
import { QuizQuestionEntity } from 'src/repo/questions/entity/questions.repo.entity';
import { SuperAdminGuard } from 'src/auth/guards/admin/guard.admin';
import { QuizQuestionRepoService } from 'src/repo/questions/questions.repo.service';
import { QueryPaginator } from 'src/common/paginator/query.paginator.decorator';
import { InputPaginator } from 'src/common/paginator/entities/query.paginator.input.entity';
import { OutputPaginator } from 'src/common/paginator/entities/query.paginator.output.entity';

@Controller('sa/quiz')
@UseGuards(SuperAdminGuard)
export class QuizQuestionsController {
  constructor(
    private commandBus: CommandBus,
    private quizRepo: QuizQuestionRepoService
  ) {}

  @Get('questions')
  async GetAll(
    @Query('bodySearchTerm') bodySearchTerm: string | undefined,
    @Query('sortBy') sortBy: keyof QuizQuestionEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator
  ) {
    let { count, questions } = await this.quizRepo.CountAndReadManyByName(
      bodySearchTerm,
      'createdAt',
      sortDirecrion,
      paginator.skipElements,
      paginator.pageSize,
      true
    );
    let questionsWithStringId = questions.map((question) => question.GetWithStringId());

    let pagedQuesitons = new OutputPaginator(count, questionsWithStringId, paginator);
    // await _WAIT_();
    return pagedQuesitons;
  }

  @Post('questions')
  async Create(@Body(new ValidateParameters()) questionData: QuizQuestionPostEntity) {
    let savedQuestion = await this.commandBus.execute<QuizQuestionsSaveCommand, QuizQuestionEntity>(
      new QuizQuestionsSaveCommand(questionData)
    );

    return savedQuestion.GetWithStringId();
  }

  @Delete('questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async Delete(@Param('id') id: string) {
    let delCount = await this.quizRepo.DeleteById(id);

    if (delCount === 1) return;

    throw new NotFoundException();
  }
}
