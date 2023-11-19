import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_URL, POSTGRES_USERNAME } from './settings';
import { TypeOrmModule } from '@nestjs/typeorm';

const typeormConfiguration = TypeOrmModule.forRoot({
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
    typeormConfiguration
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
