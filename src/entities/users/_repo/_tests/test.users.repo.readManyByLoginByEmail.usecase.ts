import { TestingModule } from "@nestjs/testing";
import { UsersRepoReadOneByLoginOrEmailCommand, UsersRepoReadOneByLoginOrEmailUseCase } from "../_application/use-cases/users.repo.readOneByLoginOrEmail.usecase";
import { UsersRepoCreateUserCommand, UsersRepoCreateUserUseCase } from "../_application/use-cases/users.repo.create.usecase";
import { UsersRepoReadOneByPropertyValueCommand, UsersRepoReadOneByPropertyValueUseCase } from "../_application/use-cases/users.repo.readOneByProperty.usecase";
import { UsersRepoClearCommand, UsersRepoClearUseCase } from "../_application/use-cases/users.repo.clear.usecase";
import { TestUsersRepoTestingModule } from "./settings/users.repo.testingModule";
import { UserCreateEntity } from "../_entities/users.create.entity";
import { UsersRepoReadManyByLoginByEmailCommand, UsersRepoReadManyByLoginByEmailUseCase } from "../_application/use-cases/users.repo.readManyByLoginByEmail.usecase";

describe(`${UsersRepoReadOneByLoginOrEmailUseCase.name}: read user`, () => {
    let module: TestingModule;

    let createUseCase: UsersRepoCreateUserUseCase;
    let readByOneProperty: UsersRepoReadOneByPropertyValueUseCase;
    let readManyByLoginByEmailUseCase: UsersRepoReadManyByLoginByEmailUseCase;
    let clearUseCase: UsersRepoClearUseCase;

    beforeAll(async () => {
        module = await TestUsersRepoTestingModule.compile();

        await module.init();

        createUseCase = module.get<UsersRepoCreateUserUseCase>(UsersRepoCreateUserUseCase);
        readManyByLoginByEmailUseCase = module.get<UsersRepoReadManyByLoginByEmailUseCase>(UsersRepoReadManyByLoginByEmailUseCase);
        readByOneProperty = module.get<UsersRepoReadOneByPropertyValueUseCase>(UsersRepoReadOneByPropertyValueUseCase);
        clearUseCase = module.get<UsersRepoClearUseCase>(UsersRepoClearUseCase);
    })

    afterAll(async () => {
        await module.close();
    })

    it('Get user by login', async () => {
        let clearCommand = new UsersRepoClearCommand();

        let createCommand_1 = new UsersRepoCreateUserCommand(new UserCreateEntity("userqwe", "special@mail.com", "123123"))
        let createCommand_2 = new UsersRepoCreateUserCommand(new UserCreateEntity("user", "notspecial@mail.com", "123123"))
        let createCommand_3 = new UsersRepoCreateUserCommand(new UserCreateEntity("bob", "bob@mail.com", "123123"))
        let createCommand_4 = new UsersRepoCreateUserCommand(new UserCreateEntity("alice", "alice@mail.com", "123123"))

        let clearDb = await clearUseCase.execute(clearCommand);

        let createUser_1 = await createUseCase.execute(createCommand_1);
        let createUser_2 = await createUseCase.execute(createCommand_2);
        let createUser_3 = await createUseCase.execute(createCommand_3);
        let createUser_4 = await createUseCase.execute(createCommand_4);

        let findUsersByLoginByEmail = await readManyByLoginByEmailUseCase.execute(new UsersRepoReadManyByLoginByEmailCommand(createCommand_2.message.login, createCommand_3.message.email));

        expect(findUsersByLoginByEmail).toMatchObject([createUser_2, createUser_3]);
    })
})