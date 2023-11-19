import { Module } from '@nestjs/common';
import { UsersService } from './_application/users.service';
import { UsersController } from './_controller/users.controller';
import { UsersRepoModule } from './_repo/users.repo.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports:[UsersRepoModule, CqrsModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
