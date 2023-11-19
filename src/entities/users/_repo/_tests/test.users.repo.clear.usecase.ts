import { TestingModule } from "@nestjs/testing";
import { UsersRepoCreateUserCommand, UsersRepoCreateUserUseCase } from "../_application/use-cases/users.repo.create.usecase";
import { UsersRepoReadUserByPropertyValueCommand, UsersRepoReadUserByPropertyValueUseCase } from "../_application/use-cases/users.repo.readByProperty.usecase";
import { TestUsersRepoTestingModule } from "./settings/users.repo.testingModule";
import { UsersRepoClearCommand, UsersRepoClearUseCase } from "../_application/use-cases/users.repo.clear.usecase";
import { UserCreateEntity } from "../_entities/users.create.entity";

describe("UsersRepo UseCase: Clear", () => {

    let module: TestingModule;

    let createUseCase: UsersRepoCreateUserUseCase;
    let readByPropertyUseCase: UsersRepoReadUserByPropertyValueUseCase;
    let clearUseCase: UsersRepoClearUseCase;

    beforeAll(async () => {
        module = await TestUsersRepoTestingModule.compile();

        createUseCase = module.get<UsersRepoCreateUserUseCase>(UsersRepoCreateUserUseCase);
        readByPropertyUseCase = module.get<UsersRepoReadUserByPropertyValueUseCase>(UsersRepoReadUserByPropertyValueUseCase);
        clearUseCase = module.get<UsersRepoClearUseCase>(UsersRepoClearUseCase)
    })

    afterAll(async () => {
        await module.close();
    })

    it('Clear after CreateUser -> User doesn`t exist(use ReadUserById)', async () => {
        let createCommand: UsersRepoCreateUserCommand = new UsersRepoCreateUserCommand(new UserCreateEntity("Max123", "max123@mail.com", "123123"));
        let createdUser = await createUseCase.execute(createCommand);

        expect(createdUser).toMatchObject({
            id: expect.any(Number),
            login: createCommand.message.login,
            email: createCommand.message.email,
            salt: expect.any(String),
            hash: expect.any(String),
            emailConfirmed: false,
            refreshPasswordTime: null,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        })

        let clearCommand = new UsersRepoClearCommand();
        let clearDb = await clearUseCase.execute(clearCommand);

        expect(clearDb).toEqual(true);

        let readCommand: UsersRepoReadUserByPropertyValueCommand = new UsersRepoReadUserByPropertyValueCommand({ propertyName: "login", propertyValue: createCommand.message.login })
        let foundUser = await readByPropertyUseCase.execute(readCommand);

        expect(foundUser).toEqual(null);
    })
})