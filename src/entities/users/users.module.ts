import { Module } from '@nestjs/common';
import { UsersService } from './_application/users.service';
import { UsersController } from './_controllers/users.controller';
import { UsersRepoModule } from './_repo/users.repo.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersServiceRegistrationUseCase } from './_application/use-cases/users.service.registration.usecase';
import { JwtGeneratorModule } from 'src/jwt/jwt.module';

export const UsersServiceUseCases = [
  UsersServiceRegistrationUseCase
]

@Module({
  imports: [CqrsModule, UsersRepoModule, JwtGeneratorModule],
  controllers: [UsersController],
  providers: [UsersService, ...UsersServiceUseCases],
  exports: [...UsersServiceUseCases]
})
export class UsersModule { }
