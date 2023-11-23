import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersRepoModule } from '../repo/users.repo.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersServiceRegistrationUseCase } from './use-cases/users.service.registration.usecase';
import { JwtGeneratorModule } from 'src/jwt/jwt.module';
import { UsersAuthController } from './controllers/users.auth.controller';
import { EmailModule } from 'src/adapters/email/email.module';
import { UsersServiceConfirmRegistrationUseCase } from './use-cases/users.service.confirmRegistration.usecase';

export const UsersServiceUseCases = [
  UsersServiceRegistrationUseCase,
  UsersServiceConfirmRegistrationUseCase
]

@Module({
  imports: [CqrsModule, UsersRepoModule, JwtGeneratorModule, EmailModule],
  controllers: [UsersController, UsersAuthController],
  providers: [...UsersServiceUseCases],
  exports: [...UsersServiceUseCases]
})
export class UsersModule { }
