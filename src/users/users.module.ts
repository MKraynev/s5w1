import { Module } from '@nestjs/common';
import { UsersService } from './_application/users.service';
import { UsersController } from './_controller/users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
