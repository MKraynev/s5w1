import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, ValidationPipe } from '@nestjs/common';
import { UserCreateEntity } from '../_repo/_entities/users.create.entity';
import { CommandBus } from '@nestjs/cqrs';
import { UsersRepoCreateUserCommand } from '../_repo/_application/use-cases/users.repo.create.usecase';
import { Users } from '../_repo/_entities/users.repo.entity';
import { UsersRepoReadOneByPropertyValueCommand } from '../_repo/_application/use-cases/users.repo.readOneByProperty.usecase';

@Controller('users')
export class UsersController {
    constructor(private commandBus: CommandBus) {}
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async SaveUser(@Body(new ValidationPipe()) user: UserCreateEntity) {
        return this.commandBus.execute<UsersRepoCreateUserCommand, Users>(new UsersRepoCreateUserCommand(user))
    }


    @Get(':id')
    async GetUserById(@Param('id') id: string){
        return this.commandBus.execute<UsersRepoReadOneByPropertyValueCommand, Users>(new UsersRepoReadOneByPropertyValueCommand({propertyName: "id", propertyValue: id}))
    }

}
