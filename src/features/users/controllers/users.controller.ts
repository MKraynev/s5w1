import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { use } from 'passport';
import { AdminGuard } from 'src/auth/guards/admin/guard.admin';
import { InputPaginator } from 'src/common/paginator/entities/query.paginator.inputEntity';
import { QueryPaginator } from 'src/common/paginator/query.paginator.decorator';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import { UsersRepoService } from 'src/repo/users/users.repo.service';


@Controller('users')
@UseGuards(AdminGuard)
export class UsersController {
    constructor(private usersRepo: UsersRepoService) { }

    @Get()
    async GetUsers(
        @Query('searchLoginTerm') loginTerm: string | undefined,
        @Query('searchEmailTerm') emailTerm: string | undefined,
        @Query('sortBy') sortBy: keyof (UserRepoEntity) = "createdAt",
        @Query('sortDirection') sortDirecrion: "desc" | "asc" = "desc",
        @QueryPaginator() paginator: InputPaginator
    ) {
        // let findUsers = await this.authService.userService.TakeByLoginOrEmail(sortBy, sortDirecrion, loginTerm, emailTerm, paginator.skipElements, paginator.pageSize);
        let findUsers = await this.usersRepo.ReadManyLikeByLoginByEmail(loginTerm, emailTerm, sortBy, sortDirecrion, paginator.skipElements, paginator.pageSize);


        let users = findUsers.foundusers.map(user => {
            let { updatedAt, emailConfirmed, hash, salt, refreshPasswordTime, ...rest } = user;
            return rest;
        })
        return users;
    }

    // @Post()
    // @HttpCode(HttpStatus.CREATED)
    // async SaveUser(@Body(new ValidationPipe()) user: CreateUserDto) {

    //     let saveUser = await this.authService.Registration(user, true);

    //     switch (saveUser.executionStatus) {
    //         case ServiceExecutionResultStatus.Success:
    //             let user = saveUser.executionResultObject;
    //             return user;
    //             break;

    //         default:
    //             throw new BadRequestException();
    //             break;
    //     }
    // }

    // @Delete(":id")
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async DeleteUser(@Param('id') id: string) {
    //     let deleteUser = await this.authService.userService.Delete(id);

    //     switch (deleteUser.executionStatus) {
    //         case ServiceExecutionResultStatus.Success:
    //             return;
    //             break;

    //         default:
    //         case ServiceExecutionResultStatus.NotFound:
    //             throw new NotFoundException();
    //             break;
    //     }
    // }
}
