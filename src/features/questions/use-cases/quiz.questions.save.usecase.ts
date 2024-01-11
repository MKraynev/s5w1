import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionPostEntity } from '../controller/entities/questions.controller.post.entity';
import { QuizQuestionEntity } from 'src/repo/questions/entity/questions.repo.entity';
import { Injectable } from '@nestjs/common';
import { QuizQuestionRepoService } from 'src/repo/questions/questions.repo.service';

export class QuizQuestionsSaveCommand {
  constructor(public questionData: QuizQuestionPostEntity) {}
}
@Injectable()
@CommandHandler(QuizQuestionsSaveCommand)
export class QuizQuestionsSaveUseCase implements ICommandHandler<QuizQuestionsSaveCommand, QuizQuestionEntity> {
  constructor(private repo: QuizQuestionRepoService) {}

  async execute(command: QuizQuestionsSaveCommand): Promise<QuizQuestionEntity> {
    let dto = await this.repo.Create(command.questionData);

    return dto;
  }
}
