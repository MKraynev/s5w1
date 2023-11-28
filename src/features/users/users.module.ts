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
import { UsersServiceResendingRegistrationUseCase } from './use-cases/users.service.resendingEmailRegistration';
import { UsersServiceGetMyDataUseCase } from './use-cases/users.service.getMyData';
import { DeviceRepoModule } from 'src/repo/devices/devices.repo.module';
import { UsersServiceNewPasswordUseCase } from './use-cases/users.service.newPassword.usecase';
import { UsersServicePasswordRecoveryUseCase } from './use-cases/users.service.passwordRecovery';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/guards/common/strategy.jwt';
import { UsersSerivceRefreshTokenUseCase } from './use-cases/users.service.refreshToken.usecase';

export const UsersServiceUseCases = [
  UsersServiceRegistrationUseCase,
  UsersServiceConfirmRegistrationUseCase,
  UsersServiceLoginUseCase,
  UsersServiceResendingRegistrationUseCase,
  UsersServiceGetMyDataUseCase,
  UsersServicePasswordRecoveryUseCase,
  UsersServiceNewPasswordUseCase,
  UsersSerivceRefreshTokenUseCase
]

@Module({
  imports: [CqrsModule, UsersRepoModule, JwtHandlerModule, EmailModule, DeviceRepoModule, PassportModule],
  controllers: [UsersController, UsersAuthController],
  providers: [...UsersServiceUseCases, AdminStrategy, JwtStrategy],
})
export class UsersModule { }
