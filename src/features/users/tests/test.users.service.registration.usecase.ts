import { TestingModule } from "@nestjs/testing";
import { RegistrationUserStatus, UsersServiceRegistrationCommand, UsersServiceRegistrationUseCase } from "../use-cases/users.service.registration.usecase";
import { TestUsersServiceTestingModule } from "./settings/users.service.testingModule";
import { UserControllerRegistrationEntity } from "../controllers/entities/users.controller.registration.entity";
import { UsersRepoClearCommand, UsersRepoClearUseCase } from "src/repo/users/use-cases/users.repo.clear.usecase";
import { UsersRepoReadOneByPropertyValueCommand, UsersRepoReadOneByPropertyValueUseCase } from "src/repo/users/use-cases/users.repo.readOneByProperty.usecase";

describe(`${UsersServiceRegistrationUseCase.name}`, () => {
    let module: TestingModule;

    let clearUserRepo: UsersRepoClearUseCase;
    let registrationUseCase: UsersServiceRegistrationUseCase;
    let readUserUseCase: UsersRepoReadOneByPropertyValueUseCase;

    beforeAll(async () => {
        module = await TestUsersServiceTestingModule.compile();

        await module.init();

        clearUserRepo = module.get<UsersRepoClearUseCase>(UsersRepoClearUseCase);
        readUserUseCase = module.get<UsersRepoReadOneByPropertyValueUseCase>(UsersRepoReadOneByPropertyValueUseCase)
        registrationUseCase = module.get<UsersServiceRegistrationUseCase>(UsersServiceRegistrationUseCase);
    })

    afterAll(async () => {
        await module.close();
    })

    it(`${UsersServiceRegistrationUseCase.name} not existed user. Expect Success`, async () => {
        let clearRepo = await clearUserRepo.execute(new UsersRepoClearCommand());
        let user = new UserControllerRegistrationEntity("someLogin", "someemail@mail.com", "123121312");

        let registration = await registrationUseCase.execute(new UsersServiceRegistrationCommand(user))
        expect(registration).toEqual(RegistrationUserStatus.Success);

        let sameRegistration = await registrationUseCase.execute(new UsersServiceRegistrationCommand(user))
        expect(sameRegistration).toEqual(RegistrationUserStatus.LoginAlreadyExist)

        let registrationWithSameLogin = await registrationUseCase.execute(new UsersServiceRegistrationCommand(new UserControllerRegistrationEntity(user.login, "another@email.com", "112312sd")))

        expect(registrationWithSameLogin).toEqual(RegistrationUserStatus.LoginAlreadyExist);

        let registrationWithSameEmail = await registrationUseCase.execute(new UsersServiceRegistrationCommand(new UserControllerRegistrationEntity("anotherlogin", user.email, "112312sd")))
        expect(registrationWithSameEmail).toEqual(RegistrationUserStatus.EmailAlreadyExist);

        let findUser = await readUserUseCase.execute(new UsersRepoReadOneByPropertyValueCommand({propertyName: 'login', propertyValue: user.login}))
        let {password, ...rest} = user;
        expect(findUser).toMatchObject(rest);
    })
})