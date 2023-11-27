import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_URL, POSTGRES_USERNAME } from "src/settings"
import { DeviceRepoEntity } from "../../entities/devices.repo.entity"
import { DeviceRepoService } from "../../devices.repo.service"
import { UserRepoEntity } from "src/repo/users/entities/users.repo.entity"
import { UsersRepoService } from "src/repo/users/users.repo.service"

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


export const TestDevicesRepoTestingModule = Test.createTestingModule({
    imports: [
        testDbConfiguration,
        TypeOrmModule.forFeature([DeviceRepoEntity, UserRepoEntity]),
    ],
    providers: [DeviceRepoService, UsersRepoService]
})
