import { UserRepoEntity } from "src/repo/users/entities/users.repo.entity";

export class UsersControllerGetEntity {
    id: string;

    login: string;

    email: string;

    createdAt: Date;

    constructor(dbUser: UserRepoEntity) {
        this.id = dbUser.id.toString();
        this.email = dbUser.email;
        this.login = dbUser.login;
        this.createdAt = dbUser.createdAt;
    }
}