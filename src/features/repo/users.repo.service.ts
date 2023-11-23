import { Injectable } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";
import { UserRepoEntity } from "./_entities/users.repo.entity";
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

    public async ReadManyByLoginByEmail(login: string, email: string) {
        let foundusers = await this.userRepo.find({
            where: [
                { login: login },
                { email: email }
            ]
        })

        return foundusers;
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
        let findObj: FindOptionsWhere<UserRepoEntity> = {};
        findObj[propertyName] = propertyValue;
        return await this.userRepo.findOneBy(findObj)
    }

    public async UpdateOne(user: UserRepoEntity) {
        let updatedUser = await this.userRepo.save(user);

        return updatedUser;
    }
}