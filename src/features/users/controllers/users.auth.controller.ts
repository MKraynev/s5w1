import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserControllerRegistrationEntity } from './entities/users.controller.registration.entity';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import {
  RegistrationUserStatus,
  UsersServiceRegistrationCommand,
} from '../use-cases/users.service.registration.usecase';
import { ValidateParameters } from 'src/common/pipes/validation.pipe';
import { UsersControllerRegistrationConfirmEntity } from './entities/users.controller.registration.confirm.entity';
import {
  ConfirmRegistrationUserStatus,
  UsersServiceConfirmRegistrationCommand,
} from '../use-cases/users.service.confirmRegistration.usecase';
import { UserLoginEntity } from './entities/users.controller.login.entity';
import {
  UserLoginDto,
  UserLoginStatus,
  UsersServiceLoginCommand,
} from '../use-cases/users.service.login.usecase';
import { UsersControllerResending } from './entities/users.controller.resending';
import {
  ResendingRegistrationStatus,
  UsersServiceResendingRegistrationCommand,
} from '../use-cases/users.service.resendingEmailRegistration';
import { JwtAuthGuard } from 'src/auth/guards/common/jwt-auth.guard';
import { ReadAccessToken } from 'src/auth/jwt/decorators/jwt.request.read.accessToken';
import { JwtServiceUserAccessTokenLoad } from 'src/auth/jwt/entities/jwt.service.accessTokenLoad';
import {
  UserPersonalInfo,
  UsersServiceGetMyDataCommand,
  UsersServiceGetMyDataUseCase,
} from '../use-cases/users.service.getMyData';
import { ReadRequestDevice } from 'src/common/decorators/requestedDeviceInfo/request.device.read';
import { RequestDeviceEntity } from 'src/common/decorators/requestedDeviceInfo/entity/request.device.entity';
import { UserControllerPasswordRecoveryEntity } from './entities/users.controller.password.recoverty.entity';
import {
  PasswordRecoveryStatus,
  UsersServicePasswordRecoveryCommand,
} from '../use-cases/users.service.passwordRecovery';
import { UserControllerNewPasswordEntity } from './entities/users.controller.new.password.entity';
import {
  NewPasswordStatus,
  UsersServiceNewPasswordCommand,
} from '../use-cases/users.service.newPassword.usecase';
import { ReadRefreshToken } from 'src/auth/jwt/decorators/jwt.request.read.refreshToken';
import { JwtServiceUserRefreshTokenLoad } from 'src/auth/jwt/entities/jwt.service.refreshTokenLoad';
import {
  RefreshTokenDto,
  RefreshTokenStatus,
  UsersSerivceRefreshTokenCommand,
} from '../use-cases/users.service.refreshToken.usecase';
import {
  LogoutStatus,
  UsersServiceLogoutCommand,
} from '../use-cases/users.service.logout.usecase';

@Throttle({ default: { limit: 5, ttl: 10000 } })
@Controller('auth')
export class UsersAuthController {
  constructor(private commandBus: CommandBus) {}

  //post -> /hometask_14/api/auth/password-recovery
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async PasswordRecovery(
    @Body(new ValidateParameters())
    recoveryDto: UserControllerPasswordRecoveryEntity,
  ) {
    let startRecoveryStatus = await this.commandBus.execute<
      UsersServicePasswordRecoveryCommand,
      PasswordRecoveryStatus
    >(new UsersServicePasswordRecoveryCommand(recoveryDto.email));

    switch (startRecoveryStatus) {
      case PasswordRecoveryStatus.Succsess:
        return;

      default:
      case PasswordRecoveryStatus.EmailNotConfirmed:
      case PasswordRecoveryStatus.UserNotFound:
        return;
    }
  }

  //post -> /hometask_14/api/auth/new-password
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async SaveNewUserPassword(
    @Body(new ValidateParameters()) newPassDto: UserControllerNewPasswordEntity,
  ) {
    let setNewPasswordStatus = await this.commandBus.execute<
      UsersServiceNewPasswordCommand,
      NewPasswordStatus
    >(
      new UsersServiceNewPasswordCommand(
        newPassDto.newPassword,
        newPassDto.recoveryCode,
      ),
    );

    switch (setNewPasswordStatus) {
      case NewPasswordStatus.Success:
        return;

      default:
      case NewPasswordStatus.UserNotFound:
      case NewPasswordStatus.NotRelevantCode:
      case NewPasswordStatus.SamePassword:
        throw new BadRequestException();
    }
  }

  //post -> /hometask_14/api/auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async Login(
    @Body(new ValidateParameters()) userDto: UserLoginEntity,
    @Res({ passthrough: true }) response: Response,
    @ReadRequestDevice() device: RequestDeviceEntity,
  ) {
    console.log('login with:', device, userDto);
    let login = await this.commandBus.execute<
      UsersServiceLoginCommand,
      UserLoginDto
    >(
      new UsersServiceLoginCommand(
        userDto.loginOrEmail,
        userDto.password,
        device,
      ),
    );

    switch (login.status) {
      case UserLoginStatus.Success:
        response.cookie('refreshToken', login.refreshToken, {
          httpOnly: true,
          secure: true,
        });
        response.status(200).send({ accessToken: login.accessToken });
        break;

      default:
      case UserLoginStatus.NotFound:
      case UserLoginStatus.WrongPassword:
        throw new UnauthorizedException();
        break;
    }
  }

  //post -> /hometask_14/api/auth/refresh-token
  @Post('refresh-token')
  public async RefreshToken(
    @ReadRequestDevice() device: RequestDeviceEntity,
    @ReadRefreshToken() token: JwtServiceUserRefreshTokenLoad,
    @Res({ passthrough: true }) response: Response,
  ) {
    let getRefreshTokens = await this.commandBus.execute<
      UsersSerivceRefreshTokenCommand,
      RefreshTokenDto
    >(new UsersSerivceRefreshTokenCommand(token, device));

    switch (getRefreshTokens.status) {
      case RefreshTokenStatus.Success:
        response.cookie('refreshToken', getRefreshTokens.refreshToken, {
          httpOnly: true,
          secure: true,
        });
        response
          .status(200)
          .send({ accessToken: getRefreshTokens.accessToken });
        break;

      default:
      case RefreshTokenStatus.TokenExpired:
      case RefreshTokenStatus.UserDeviceNotFound:
      case RefreshTokenStatus.UserNotFound:
      case RefreshTokenStatus.WrongDevice:
        throw new UnauthorizedException();
        break;
    }
  }

  //post -> /hometask_14/api/auth/registration-confirmation
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async ConfrimEmail(
    @Body(new ValidateParameters())
    codeDto: UsersControllerRegistrationConfirmEntity,
    @ReadRequestDevice() device: RequestDeviceEntity,
  ) {
    let confirmEmailStatus = await this.commandBus.execute<
      UsersServiceConfirmRegistrationCommand,
      ConfirmRegistrationUserStatus
    >(new UsersServiceConfirmRegistrationCommand(codeDto.code));

    switch (confirmEmailStatus) {
      case ConfirmRegistrationUserStatus.Success:
        return;
        break;

      default:
      case ConfirmRegistrationUserStatus.NotFound:
      case ConfirmRegistrationUserStatus.EmailAlreadyConfirmed:
        throw new BadRequestException({
          errorsMessages: [{ message: 'Wrong code', field: 'code' }],
        });
        break;
    }
  }

  //post -> /hometask_14/api/auth/registration
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async Registration(
    @Body(new ValidateParameters()) user: UserControllerRegistrationEntity,
  ) {
    let saveUserStatus = await this.commandBus.execute<
      UsersServiceRegistrationCommand,
      RegistrationUserStatus
    >(new UsersServiceRegistrationCommand(user));

    switch (saveUserStatus) {
      case RegistrationUserStatus.Success:
        return;

      case RegistrationUserStatus.EmailAlreadyExist:
        throw new BadRequestException({
          errorsMessages: [{ message: 'Email already exist', field: 'email' }],
        });
        break;

      default:
      case RegistrationUserStatus.LoginAlreadyExist:
        throw new BadRequestException({
          errorsMessages: [{ message: 'Login already exist', field: 'login' }],
        });
        break;
    }
  }

  //post -> /hometask_14/api/auth/registration-email-resending
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async ResendingEmail(
    @Body(new ValidateParameters()) userDto: UsersControllerResending,
  ) {
    let resendingStatus = await this.commandBus.execute<
      UsersServiceResendingRegistrationCommand,
      ResendingRegistrationStatus
    >(new UsersServiceResendingRegistrationCommand(userDto));

    switch (resendingStatus) {
      case ResendingRegistrationStatus.Success:
        return;
        break;

      default:
      case ResendingRegistrationStatus.UserNotFound:
      case ResendingRegistrationStatus.EmailAlreadyConfirmed:
        throw new BadRequestException({
          errorsMessages: [{ message: 'Wrong email', field: 'email' }],
        });
        break;
    }
  }

  //post -> /hometask_14/api/auth/logout
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async Logout(
    @ReadRefreshToken() refreshToken: JwtServiceUserRefreshTokenLoad,
    @ReadRequestDevice() device: RequestDeviceEntity,
  ) {
    let logoutStatus = await this.commandBus.execute<
      UsersServiceLogoutCommand,
      LogoutStatus
    >(new UsersServiceLogoutCommand(device, refreshToken));

    switch (logoutStatus) {
      case LogoutStatus.Success:
        return;
        break;

      default:
      case LogoutStatus.DeviceNotFound:
      case LogoutStatus.ExpiredToken:
      case LogoutStatus.WrongDevice:
        throw new UnauthorizedException();
        break;
    }
  }

  //get -> /hometask_14/api/auth/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  public async GetPersonalData(
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let foundUserData = await this.commandBus.execute<
      UsersServiceGetMyDataCommand,
      UserPersonalInfo
    >(new UsersServiceGetMyDataCommand(tokenLoad));

    if (foundUserData) return foundUserData;

    throw new NotFoundException();
  }
}
