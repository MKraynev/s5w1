import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersServiceRegistrationUseCase } from './use-cases/users.service.registration.usecase';
import { JwtHandlerModule } from 'src/auth/jwt/jwt.module';
import { UsersAuthController } from './controllers/users.auth.controller';
import { EmailModule } from 'src/adapters/email/email.module';
import { UsersServiceConfirmRegistrationUseCase } from './use-cases/users.service.confirmRegistration.usecase';
import { UsersServiceLoginUseCase } from './use-cases/users.service.login.usecase';
import { UsersRepoModule } from 'src/repo/users/users.repo.module';
import { AdminStrategy } from 'src/auth/guards/admin/strategy.admin';
import { UsersRepoService } from 'src/repo/users/users.repo.service';

export const UsersServiceUseCases = [
  UsersServiceRegistrationUseCase,
  UsersServiceConfirmRegistrationUseCase,
  UsersServiceLoginUseCase
]

@Module({
  imports: [CqrsModule, UsersRepoModule, JwtHandlerModule, EmailModule],
  controllers: [UsersController, UsersAuthController],
  providers: [...UsersServiceUseCases, AdminStrategy],
})
export class UsersModule { }
