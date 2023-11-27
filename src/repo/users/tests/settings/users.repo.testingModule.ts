import { CqrsModule } from "@nestjs/cqrs"
import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserRepoEntity } from "../../entities/users.repo.entity"
import { UsersRepoService } from "../../users.repo.service"
import { UsersRepoUseCases } from "../../users.repo.module"
import { POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_URL, POSTGRES_USERNAME } from "src/settings"
import { DeviceRepoEntity } from "src/repo/devices/entities/devices.repo.entity"
import { DeviceRepoService } from "src/repo/devices/devices.repo.service"

export const testDbConfiguration = TypeOrmModule.forRoot({
    type: 'postgres',
    host: POSTGRES_URL,
    port: POSTGRES_PORT,
    username: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD,
    database: "Test",
    autoLoadEntities: true,
    synchronize: true,
})


export const TestUsersRepoTestingModule = Test.createTestingModule({
    imports: [
        testDbConfiguration,
        CqrsModule,
        TypeOrmModule.forFeature([UserRepoEntity, DeviceRepoEntity])
    ],
    providers: [UsersRepoService, DeviceRepoService, ...UsersRepoUseCases]
})
