import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_URL, POSTGRES_USERNAME } from './settings';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './adapters/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

export const typeormConfiguration = TypeOrmModule.forRoot({
  type: 'postgres',
  host: POSTGRES_URL,
  port: POSTGRES_PORT,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
})

@Module({
  imports: [
    UsersModule,
    EmailModule,
    JwtModule,
    typeormConfiguration,
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 200, }])
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule { }
