import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionEntity } from './entity/questions.repo.entity';
import { QuizQuestionRepoService } from './questions.repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestionEntity])],
  providers: [QuizQuestionRepoService],
  exports: [QuizQuestionRepoService],
})
export class QuizQuestRepoModule {}
