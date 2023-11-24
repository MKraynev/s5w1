import { Injectable } from "@nestjs/common";
import { FindOptionsWhere, Like, Repository } from "typeorm";
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

    public async ReadManyByLoginByEmail(
        login: string,
        email: string,
        sortBy: keyof (UserRepoEntity) = "createdAt",
        sortDirection: "asc" | "desc" = "desc",
        skip: number = 0,
        limit: number = 10
    ) {
        let orderObj: any = {}
        orderObj[sortBy] = sortDirection;

        let loginPattern: string = login || "";
        let emailPattern: string = email || "";

        let countAll = await this.userRepo.count({
            where: [
                { login: Like(`%${loginPattern}%`) },
                { email: Like(`%${emailPattern}%`) }
            ]
        });


        let foundusers = await this.userRepo.find({
            where: [
                { login: Like(`%${loginPattern}%`) },
                { email: Like(`%${emailPattern}%`) }
            ],
            order: orderObj,
            skip: skip,
            take: limit
        })

        return { countAll, foundusers };
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
        // let findObj: FindOptionsWhere<UserRepoEntity> = {};
        let findObj: any = {};
        findObj[propertyName] = propertyValue;

        return await this.userRepo.findOneBy(findObj)
    }

    public async UpdateOne(user: UserRepoEntity) {
        let updatedUser = await this.userRepo.save(user);

        return updatedUser;
    }
}