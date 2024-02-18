import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_URL, POSTGRES_USERNAME } from './settings';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SuperAdminModule } from './features/superAdmin/super.admin.module';
import { DevicesModule } from './features/devices/devices.module';
import { BlogModule } from './features/blogs/blogs.module';
import { PostModule } from './features/posts/post.module';
import { CommentsModule } from './features/comments/comments.module';
import { QuizQuestRepoModule } from './repo/questions/questions.repo.module';
import { QuizQuestionsModule } from './features/questions/quiz.questions.module';
import { GamesModule } from './features/games/games.module';
import { QuizGameQuestionsModule } from './repo/QuizGameQuestions/quiz.game.questions.repo.module';

export const typeormConfiguration = TypeOrmModule.forRoot({
  type: 'postgres',
  host: POSTGRES_URL,
  port: POSTGRES_PORT,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
});

@Module({
  imports: [
    UsersModule,
    DevicesModule,
    BlogModule,
    PostModule,
    CommentsModule,
    QuizQuestionsModule,
    QuizGameQuestionsModule,
    GamesModule,
    typeormConfiguration,
    ThrottlerModule.forRoot([{ ttl: 20000, limit: 300 }]),
    SuperAdminModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
