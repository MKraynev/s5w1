import { TestingModule } from "@nestjs/testing";
import { UsersRepoReadOneByFirstOrSecondPropertyUseCase } from "../_application/use-cases/users.repo.readOneByLoginOrEmail.usecase";
import { UsersRepoCreateUserUseCase } from "../_application/use-cases/users.repo.create.usecase";
import { UsersRepoReadOneByPropertyValueUseCase } from "../_application/use-cases/users.repo.readOneByProperty.usecase";
import { UsersRepoClearUseCase } from "../_application/use-cases/users.repo.clear.usecase";
import { TestUsersRepoTestingModule } from "./settings/users.repo.testingModule";

describe(`${UsersRepoReadOneByFirstOrSecondPropertyUseCase.name}: read user`, ()=>{
    let module: TestingModule;

    let createUseCase: UsersRepoCreateUserUseCase;
    let readByPropertyUseCase: UsersRepoReadOneByPropertyValueUseCase;
    let readByFirstOrSecondPropertyUseCase: UsersRepoReadOneByPropertyValueUseCase;
    let clearUseCase: UsersRepoClearUseCase;

    beforeAll(async () => {
        module = await TestUsersRepoTestingModule.compile();

        createUseCase = module.get<UsersRepoCreateUserUseCase>(UsersRepoCreateUserUseCase);
        readByPropertyUseCase = module.get<UsersRepoReadOneByPropertyValueUseCase>(UsersRepoReadOneByPropertyValueUseCase);
    })

    afterAll(async () => {
        await module.close();
    })

    //TODO доделать тест
})