import { TestingModule } from "@nestjs/testing";
import { RegistrationUserStatus, UsersServiceRegistrationCommand, UsersServiceRegistrationUseCase } from "../_application/use-cases/users.service.registration.usecase";
import { UsersRepoReadOneByPropertyValueCommand, UsersRepoReadOneByPropertyValueUseCase } from "../_repo/_application/use-cases/users.repo.readOneByProperty.usecase";
import { TestUsersServiceTestingModule } from "./settings/users.service.testingModule";
import { UsersRepoClearCommand, UsersRepoClearUseCase } from "../_repo/_application/use-cases/users.repo.clear.usecase";
import { UserCreateEntity } from "../_repo/_entities/users.create.entity";

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
        let user = new UserCreateEntity("someLogin", "someemail@mail.com", "123121312");

        let registration = await registrationUseCase.execute(new UsersServiceRegistrationCommand(user))
        expect(registration).toEqual(RegistrationUserStatus.Success);

        let sameRegistration = await registrationUseCase.execute(new UsersServiceRegistrationCommand(user))
        expect(sameRegistration).toEqual(RegistrationUserStatus.LoginAlreadyExist)

        let registrationWithSameLogin = await registrationUseCase.execute(new UsersServiceRegistrationCommand(new UserCreateEntity(user.login, "another@email.com", "112312sd")))

        expect(registrationWithSameLogin).toEqual(RegistrationUserStatus.LoginAlreadyExist);

        let registrationWithSameEmail = await registrationUseCase.execute(new UsersServiceRegistrationCommand(new UserCreateEntity("anotherlogin", user.email, "112312sd")))
        expect(registrationWithSameEmail).toEqual(RegistrationUserStatus.EmailAlreadyExist);

        let findUser = await readUserUseCase.execute(new UsersRepoReadOneByPropertyValueCommand({propertyName: 'login', propertyValue: user.login}))
        let {password, ...rest} = user;
        expect(findUser).toMatchObject(rest);
    })
})