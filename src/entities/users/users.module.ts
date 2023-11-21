import { Module } from '@nestjs/common';
import { UsersService } from './_application/users.service';
import { UsersController } from './_controller/users.controller';
import { UsersRepoModule, UsersRepoUseCases } from './_repo/users.repo.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersServiceRegistrationUseCase } from './_application/use-cases/users.service.registration.usecase';

export const UsersServiceUseCases = [
  UsersServiceRegistrationUseCase
]

@Module({
  imports: [CqrsModule, UsersRepoModule],
  controllers: [UsersController],
  providers: [UsersService, ...UsersServiceUseCases],
  exports: [...UsersServiceUseCases]
})
export class UsersModule { }
