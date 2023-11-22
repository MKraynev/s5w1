import { Module } from '@nestjs/common';
import { UsersModule } from './entities/users/users.module';
import { POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_URL, POSTGRES_USERNAME } from './settings';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';

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
    typeormConfiguration
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
