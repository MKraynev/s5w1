import { Injectable } from "@nestjs/common";
import { UserCreateEntity } from "../_entities/users.create.entity";
import { UserRepoEntity } from "../_entities/users.repo.entity";
import { CommandBus } from "@nestjs/cqrs";
import bcrypt from "bcrypt"
import { use } from "passport";

@Injectable()
export class UsersRepoService{
    
    public async InitEntity(inputUser: UserCreateEntity, confirmEmail: boolean = false): Promise<UserRepoEntity>{
        let user: UserRepoEntity = new UserRepoEntity();
        user.login = inputUser.login;
        user.email = inputUser.email;
        user.salt = (await bcrypt.genSalt()).toString();
        user.hash = await bcrypt.hash(inputUser.password, user.salt);
        user.emailConfirmed = confirmEmail;

        return user;
    }
}