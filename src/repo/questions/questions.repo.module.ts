import { Module } from '@nestjs/common';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionEntity } from './entity/questions.repo.entity';
import { QuizQuestionRepoService } from './questions.repo.service';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestionEntity])],
  providers: [QuizQuestionRepoService],
  exports: [QuizQuestionRepoService],
})
export class QuizQuestRepoModule {}
