import { Body, Controller, Get, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { UserCreateEntity } from '../_repo/_entities/users.create.entity';
import { CommandBus } from '@nestjs/cqrs';
import { UsersRepoCreateUserCommand } from '../_repo/_application/use-cases/users.repo.save.use-case';
import { UserRepoEntity } from '../_repo/_entities/users.repo.entity';

@Controller('users')
export class UsersController {
    constructor(private commandBus: CommandBus) {
        
    }
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async SaveUser(@Body(new ValidationPipe()) user: UserCreateEntity) {
        return this.commandBus.execute<UsersRepoCreateUserCommand, UserRepoEntity>(new UsersRepoCreateUserCommand(user))
    }

}
