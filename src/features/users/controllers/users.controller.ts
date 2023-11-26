import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { use } from 'passport';
import { AdminGuard } from 'src/auth/guards/admin/guard.admin';
import { InputPaginator } from 'src/common/paginator/entities/query.paginator.inputEntity';
import { OutputPaginator } from 'src/common/paginator/entities/query.paginator.outputEntity';
import { QueryPaginator } from 'src/common/paginator/query.paginator.decorator';
import { UserRepoEntity } from 'src/repo/users/entities/users.repo.entity';
import { UsersRepoService } from 'src/repo/users/users.repo.service';
import { UserControllerRegistrationEntity } from './entities/users.controller.registration.entity';


@Controller('sa/users')
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
        if (!(loginTerm || emailTerm)) {
            loginTerm = "";
            emailTerm = "";
        }

        let { countAll, foundusers } = await this.usersRepo.ReadManyLikeByLoginByEmail(loginTerm, emailTerm, sortBy, sortDirecrion, paginator.skipElements, paginator.pageSize);


        let users = foundusers.map(user => user.Transform())

        let count = countAll;
        let pagedUsers = new OutputPaginator(count, users, paginator);

        return pagedUsers;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async SaveUser(@Body(new ValidationPipe()) user: UserControllerRegistrationEntity) {

        let dbUser = await this.usersRepo.Create(user, true);
        let transformedUser = dbUser.Transform();

        return transformedUser;
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async DeleteUser(@Param('id') id: string) {
        let userId = +id;

        let deletedUser = userId && await this.usersRepo.DeleteOne(userId);

        if (deletedUser)
            return;

        throw new NotFoundException();
    }
}
