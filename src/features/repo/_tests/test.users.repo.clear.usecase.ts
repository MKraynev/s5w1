import { TestingModule } from "@nestjs/testing";
import { UsersRepoCreateUserCommand, UsersRepoCreateUserUseCase } from "../_application/use-cases/users.repo.create.usecase";
import { UsersRepoReadOneByPropertyValueCommand, UsersRepoReadOneByPropertyValueUseCase } from "../_application/use-cases/users.repo.readOneByProperty.usecase";
import { TestUsersRepoTestingModule } from "./settings/users.repo.testingModule";
import { UsersRepoClearCommand, UsersRepoClearUseCase } from "../_application/use-cases/users.repo.clear.usecase";
import { UserControllerRegistrationEntity } from "../../users/controllers/entities/users.controller.registration.entity";
import exp from "constants";

describe("UsersRepo UseCase: Clear", () => {

    let module: TestingModule;

    let createUseCase: UsersRepoCreateUserUseCase;
    let readByPropertyUseCase: UsersRepoReadOneByPropertyValueUseCase;
    let clearUseCase: UsersRepoClearUseCase;

    beforeAll(async () => {
        module = await TestUsersRepoTestingModule.compile();

        await module.init();
        
        createUseCase = module.get<UsersRepoCreateUserUseCase>(UsersRepoCreateUserUseCase);
        readByPropertyUseCase = module.get<UsersRepoReadOneByPropertyValueUseCase>(UsersRepoReadOneByPropertyValueUseCase);
        clearUseCase = module.get<UsersRepoClearUseCase>(UsersRepoClearUseCase)
    })

    afterAll(async () => {
        await module.close();
    })

    it('Clear after CreateUser -> User doesn`t exist(use ReadUserById)', async () => {
        let createCommand: UsersRepoCreateUserCommand = new UsersRepoCreateUserCommand(new UserControllerRegistrationEntity("Max123", "max123@mail.com", "123123"));
        let createdUser = await createUseCase.execute(createCommand);
        let readUser = await readByPropertyUseCase.execute(new UsersRepoReadOneByPropertyValueCommand({ propertyName: "login", propertyValue: createCommand.message.login }))

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

        expect(createdUser).toEqual(readUser);

        let clearCommand = new UsersRepoClearCommand();
        let clearDb = await clearUseCase.execute(clearCommand);

        expect(clearDb).toEqual(expect.any(Number));

        let readCommand: UsersRepoReadOneByPropertyValueCommand = new UsersRepoReadOneByPropertyValueCommand({ propertyName: "login", propertyValue: createCommand.message.login })
        let foundUser = await readByPropertyUseCase.execute(readCommand);

        expect(foundUser).toEqual(null);
    })
})