import { UserLoginStatus, UsersServiceLoginCommand, UsersServiceLoginUseCase } from "../use-cases/users.service.login.usecase";
import { TestUsersServiceTestingModule } from "./settings/users.service.testingModule";
import { TestingModule } from "@nestjs/testing";
import { UserControllerRegistrationEntity } from "../controllers/entities/users.controller.registration.entity";
import { UsersRepoService } from "src/repo/users/users.repo.service";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";

describe(`${UsersServiceLoginUseCase.name} test`, () => {
    let module: TestingModule;

    let usersRepo: UsersRepoService;
    let loginUseCase: UsersServiceLoginUseCase;


    beforeAll(async () => {
        module = await TestUsersServiceTestingModule.compile();

        await module.init();

        usersRepo = module.get<UsersRepoService>(UsersRepoService);
        loginUseCase = module.get<UsersServiceLoginUseCase>(UsersServiceLoginUseCase)
    })

    afterAll(async () => {
        await module.close();
    })

    it(`${UsersServiceLoginUseCase.name} login valid user`, async () => {
        await usersRepo.DeleteAll();

        let user = new UserControllerRegistrationEntity("someLogin", "some@mail.com", "1233123");
        let savedUser = await usersRepo.Create(user);
        savedUser.emailConfirmed = true;
        savedUser = await usersRepo.UpdateOne(savedUser);

        let registration = await loginUseCase.execute(new UsersServiceLoginCommand(user.login, user.password, new RequestDeviceEntity("somedev", "1312313213")));

        expect(registration.status).toEqual(UserLoginStatus.Success);
        expect(registration.accessToken).not.toBeUndefined();
    })
})