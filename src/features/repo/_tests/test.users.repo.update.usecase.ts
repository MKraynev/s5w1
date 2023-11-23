import { TestingModule } from "@nestjs/testing";
import { UsersRepoUpdateOneCommand, UsersRepoUpdateOneUseCase } from "../_application/use-cases/users.repo.update.usecase";
import { TestUsersRepoTestingModule } from "./settings/users.repo.testingModule";
import { UsersRepoCreateUserCommand, UsersRepoCreateUserUseCase } from "../_application/use-cases/users.repo.create.usecase";
import { UsersRepoReadOneByPropertyValueCommand, UsersRepoReadOneByPropertyValueUseCase } from "../_application/use-cases/users.repo.readOneByProperty.usecase";
import { UsersRepoClearCommand, UsersRepoClearUseCase } from "../_application/use-cases/users.repo.clear.usecase";
import { UserControllerRegistrationEntity } from "../../users/controllers/entities/users.controller.registration.entity";
import { UserRepoEntity } from "../_entities/users.repo.entity";

describe(`${UsersRepoUpdateOneUseCase.name} test`, () => {
    let module: TestingModule;

    let clearUseCase: UsersRepoClearUseCase;
    let createUseCase: UsersRepoCreateUserUseCase;
    let readByOneProperty: UsersRepoReadOneByPropertyValueUseCase;

    let updateUseCase: UsersRepoUpdateOneUseCase;

    beforeAll(async () => {
        module = await TestUsersRepoTestingModule.compile();

        await module.init();

        clearUseCase = module.get<UsersRepoClearUseCase>(UsersRepoClearUseCase);
        createUseCase = module.get<UsersRepoCreateUserUseCase>(UsersRepoCreateUserUseCase);
        readByOneProperty = module.get<UsersRepoReadOneByPropertyValueUseCase>(UsersRepoReadOneByPropertyValueUseCase);
        updateUseCase = module.get<UsersRepoUpdateOneUseCase>(UsersRepoUpdateOneUseCase);
    })

    afterAll(async () => {
        await module.close();
    })

    it('User updated successfully', async () => {
        let clearUsersCommand = new UsersRepoClearCommand();
        let createUserCommand = new UsersRepoCreateUserCommand(new UserControllerRegistrationEntity("userqwe", "special@mail.com", "123123"))
        let findYserByOneProperty = new UsersRepoReadOneByPropertyValueCommand({ propertyName: "login", propertyValue: createUserCommand.message.login })


        let clearDb = await clearUseCase.execute(clearUsersCommand);
        let createUser = await createUseCase.execute(createUserCommand);
        let readUser = await readByOneProperty.execute(findYserByOneProperty);

        let userInitCopy = new UserRepoEntity();
        Object.assign(userInitCopy, readUser);

        let newEmail = "newemail@mail.com";
        let newLogin = "newLogin";

        readUser.email = newEmail;
        readUser.login = newLogin;

        let updateUserCommand = new UsersRepoUpdateOneCommand(readUser)

        let updatedUser = await updateUseCase.execute(updateUserCommand);

        expect(userInitCopy.login).not.toEqual(updatedUser);
        expect(updatedUser.login).toEqual(newLogin);
        expect(updatedUser.email).toEqual(newEmail);
    })
})