import { Injectable } from "@nestjs/common";
import { FindOptionsWhere, Like, Raw, Repository } from "typeorm";
import { UserRepoEntity } from "./entities/users.repo.entity";
import { UserControllerRegistrationEntity } from "src/features/users/controllers/entities/users.controller.registration.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersRepoService {

    constructor(
        @InjectRepository(UserRepoEntity)
        private userRepo: Repository<UserRepoEntity>
    ) { }

    public async DeleteAll() {
        let deleteAll = await this.userRepo.delete({});

        return deleteAll.affected;
    }

    public async Create(userData: UserControllerRegistrationEntity) {
        let userDto = await UserRepoEntity.Init(userData);
        let savedUser = await this.userRepo.save(userDto);

        return savedUser
    }

    public async ReadManyLikeByLoginByEmail(
        login: string,
        email: string,
        sortBy: keyof (UserRepoEntity) = "createdAt",
        sortDirection: "asc" | "desc" = "desc",
        skip: number = 0,
        limit: number = 10
    ) {
        let orderObj: any = {}
        orderObj[sortBy] = sortDirection;

        let loginValue: string = login || "";
        let emailValue: string = email || "";

        let caseInsensitiveSearchPattern = (column: string, inputValue: string) => `LOWER(${column}) Like '%${inputValue.toLowerCase()}%'`;

        let countAll = await this.userRepo.count({
            where: [
                { login: Raw(alias => caseInsensitiveSearchPattern(alias, loginValue)) },
                { email: Raw(alias => caseInsensitiveSearchPattern(alias, emailValue)) }
            ]
        });


        let foundusers = await this.userRepo.find({
            where: [
                { login: Raw(alias => caseInsensitiveSearchPattern(alias, loginValue)) },
                { email: Raw(alias => caseInsensitiveSearchPattern(alias, emailValue)) }
            ],
            order: orderObj,
            skip: skip,
            take: limit
        })

        return { countAll, foundusers };
    }

    public async ReadManyCertainByLoginByPassword(login: string, email: string) {
        let founduser = await this.userRepo.find({
            where: [
                { login: login },
                { email: email }
            ]
        }
        )

        return founduser;
    }



    public async ReadOneByLoginOrEmail(loginOrEmail: string) {
        let founduser = await this.userRepo.findOne({
            where: [
                { login: loginOrEmail },
                { email: loginOrEmail }
            ]
        }
        )

        return founduser;
    }

    public async ReadOneByPropertyValue(propertyName: keyof UserRepoEntity, propertyValue: any) {

        let findObj: any = {};
        findObj[propertyName] = propertyValue;

        return await this.userRepo.findOneBy(findObj)
    }

    public async UpdateOne(user: UserRepoEntity) {
        let updatedUser = await this.userRepo.save(user);

        return updatedUser;
    }
}