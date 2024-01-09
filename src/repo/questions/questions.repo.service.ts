import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestionEntity } from './entity/questions.repo.entity';
import { Repository } from 'typeorm';
import { QuizQuestionPostEntity } from 'src/features/questions/controller/entities/questions.controller.post.entity';

export class QuizQuestionRepoService {
  constructor(@InjectRepository(QuizQuestionEntity) private repo: Repository<QuizQuestionEntity>) {}

  public async Create(inputData: QuizQuestionPostEntity, published: boolean = false) {
    let quizQuestDto = QuizQuestionEntity.Init(inputData.body, inputData.correctAnswers, published);

    let saveRes = await this.repo.save(quizQuestDto);

    return saveRes;
  }
}
