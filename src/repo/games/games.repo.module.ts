import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesRepoEntity } from './entities/games.repo.entity';
import { GamesRepoService } from './games.repo.service';
import { QuizGameAnswerRepoEntity } from './entities/games.answer.repo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GamesRepoEntity, QuizGameAnswerRepoEntity])],
  providers: [GamesRepoService],
  exports: [GamesRepoService],
})
export class QuizGameRepoModule {}
