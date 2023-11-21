import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, ValidationPipe } from '@nestjs/common';
import { UserCreateEntity } from '../_repo/_entities/users.create.entity';
import { CommandBus } from '@nestjs/cqrs';
import { UsersRepoCreateUserCommand } from '../_repo/_application/use-cases/users.repo.create.usecase';
import { UserRepoEntity } from '../_repo/_entities/users.repo.entity';
import { UsersRepoReadOneByPropertyValueCommand } from '../_repo/_application/use-cases/users.repo.readOneByProperty.usecase';
import { RegistrationUserStatus, UsersServiceRegistrationCommand } from '../_application/use-cases/users.service.registration.usecase';

@Controller('users')
export class UsersController {
    constructor(private commandBus: CommandBus) {}
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async SaveUser(@Body(new ValidationPipe()) user: UserCreateEntity) {
        // return this.commandBus.execute<UsersRepoCreateUserCommand, UserRepoEntity>(new UsersRepoCreateUserCommand(user))
        return this.commandBus.execute<UsersServiceRegistrationCommand, RegistrationUserStatus>(new UsersServiceRegistrationCommand(user))
    }


    @Get(':id')
    async GetUserById(@Param('id') id: string){
        return this.commandBus.execute<UsersRepoReadOneByPropertyValueCommand, UserRepoEntity>(new UsersRepoReadOneByPropertyValueCommand({propertyName: "id", propertyValue: id}))
    }

}
