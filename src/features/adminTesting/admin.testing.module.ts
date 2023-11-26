import { Module } from "@nestjs/common";
import { UsersRepoModule } from "src/repo/users/users.repo.module";
import { AdminTestingController } from "./admin.testing.controller";

@Module({
    imports: [UsersRepoModule],
    controllers: [AdminTestingController]
})
export class AdminTestingModule { }