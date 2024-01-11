import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestionEntity } from './entity/questions.repo.entity';
import { FindOptionsOrder, FindOptionsWhere, Raw, Repository } from 'typeorm';
import { QuizQuestionPostEntity } from 'src/features/questions/controller/entities/questions.controller.post.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizQuestionRepoService {
  constructor(@InjectRepository(QuizQuestionEntity) private repo: Repository<QuizQuestionEntity>) {}

  public async Create(inputData: QuizQuestionPostEntity, published: boolean = false) {
    let quizQuestDto = QuizQuestionEntity.Init(inputData.body, inputData.correctAnswers, published);

    let saveRes = await this.repo.save(quizQuestDto);

    return saveRes;
  }

  public async DeleteAll() {
    await this.repo.delete({});
  }

  public async DeleteById(id: string) {
    let id_num = +id;

    if (Number.isNaN(id_num)) return 0;

    let delRes = await this.repo.delete({ id: id_num });

    return delRes.affected;
  }

  public async CountAndReadManyByName(
    bodyPattern: string,
    sortBy: 'createdAt' = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number = 0,
    limit: number = 10,
    format: boolean = false
  ): Promise<{
    count: number;
    questions: QuizQuestionEntity[];
  }> {
    let BodySearchPattern: FindOptionsWhere<QuizQuestionEntity> = {};

    let caseInsensitiveSearchPattern = (column: string, inputValue: string) =>
      `LOWER(${column}) Like '%${inputValue.toLowerCase()}%'`;

    if (bodyPattern) BodySearchPattern['body'] = Raw((alias) => caseInsensitiveSearchPattern(alias, bodyPattern));

    let orderObj: FindOptionsOrder<QuizQuestionEntity> = {};
    orderObj[sortBy] = sortDirection;

    let count = await this.repo.count({ where: BodySearchPattern });
    let questions = await this.repo.find({
      where: BodySearchPattern,
      order: orderObj,
      skip: skip,
      take: limit,
    });

    return { count, questions: questions };
  }
}
