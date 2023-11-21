import { TestingModule } from "@nestjs/testing";
import { UsersRepoReadOneByLoginOrEmailCommand, UsersRepoReadOneByLoginOrEmailUseCase } from "../_application/use-cases/users.repo.readOneByLoginOrEmail.usecase";
import { UsersRepoCreateUserCommand, UsersRepoCreateUserUseCase } from "../_application/use-cases/users.repo.create.usecase";
import { UsersRepoReadOneByPropertyValueCommand, UsersRepoReadOneByPropertyValueUseCase } from "../_application/use-cases/users.repo.readOneByProperty.usecase";
import { UsersRepoClearCommand, UsersRepoClearUseCase } from "../_application/use-cases/users.repo.clear.usecase";
import { TestUsersRepoTestingModule } from "./settings/users.repo.testingModule";
import { UserCreateEntity } from "../_entities/users.create.entity";

describe(`${UsersRepoReadOneByLoginOrEmailUseCase.name}: read user`, () => {
    let module: TestingModule;

    let createUseCase: UsersRepoCreateUserUseCase;
    let readByOneProperty: UsersRepoReadOneByPropertyValueUseCase;
    let readByFirstOrSecondPropertyUseCase: UsersRepoReadOneByLoginOrEmailUseCase;
    let clearUseCase: UsersRepoClearUseCase;

    beforeAll(async () => {
        module = await TestUsersRepoTestingModule.compile();

        createUseCase = module.get<UsersRepoCreateUserUseCase>(UsersRepoCreateUserUseCase);
        readByFirstOrSecondPropertyUseCase = module.get<UsersRepoReadOneByLoginOrEmailUseCase>(UsersRepoReadOneByLoginOrEmailUseCase);
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

        let findYserByOneProperty = new UsersRepoReadOneByPropertyValueCommand({ propertyName: "login", propertyValue: createCommand_1.message.login })
        let findUserByLoginCommand = new UsersRepoReadOneByLoginOrEmailCommand({ firstProperty: "login", secondProperty: "email", propertyValue: createCommand_1.message.login })
        let findUserByEmailCommand = new UsersRepoReadOneByLoginOrEmailCommand({ firstProperty: "login", secondProperty: "email", propertyValue: createCommand_1.message.email })

        let clearDb = await clearUseCase.execute(clearCommand);

        let createUser_1 = await createUseCase.execute(createCommand_1);
        let createUser_2 = await createUseCase.execute(createCommand_2);
        let createUser_3 = await createUseCase.execute(createCommand_3);
        let createUser_4 = await createUseCase.execute(createCommand_4);

        let findUser = await readByOneProperty.execute(findYserByOneProperty);

        let findUserByLogin = await readByFirstOrSecondPropertyUseCase.execute(findUserByLoginCommand);
        let findUseByEmail = await readByFirstOrSecondPropertyUseCase.execute(findUserByEmailCommand);


        expect(findUser).toMatchObject(createUser_1);
        expect(findUserByLogin).toMatchObject(createUser_1);
        expect(findUseByEmail).toEqual(createUser_1);
    })
})