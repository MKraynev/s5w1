import { UserLoginStatus, UsersServiceLoginCommand, UsersServiceLoginUseCase } from "../use-cases/users.service.login.usecase";
import { TestUsersServiceTestingModule } from "./settings/users.service.testingModule";
import { TestingModule } from "@nestjs/testing";
import { UserControllerRegistrationEntity } from "../controllers/entities/users.controller.registration.entity";
import { UsersRepoService } from "src/repo/users/users.repo.service";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";
import { DeviceRepoService } from "src/repo/devices/devices.repo.service";
import { UserRepoEntity } from "src/repo/users/entities/users.repo.entity";
import { UsersSerivceRefreshTokenCommand, UsersSerivceRefreshTokenUseCase } from "../use-cases/users.service.refreshToken.usecase";
import { JwtHandlerService } from "src/auth/jwt/jwt.service";

describe(`${UsersServiceLoginUseCase.name} test`, () => {
    let module: TestingModule;

    let usersRepo: UsersRepoService;
    let deviceRepo: DeviceRepoService;
    let loginUseCase: UsersServiceLoginUseCase;
    let refreshUseCase: UsersSerivceRefreshTokenUseCase;
    let jwtHandleService: JwtHandlerService;

    beforeAll(async () => {
        module = await TestUsersServiceTestingModule.compile();

        await module.init();

        usersRepo = module.get<UsersRepoService>(UsersRepoService);
        deviceRepo = module.get<DeviceRepoService>(DeviceRepoService)
        loginUseCase = module.get<UsersServiceLoginUseCase>(UsersServiceLoginUseCase)
        refreshUseCase = module.get<UsersSerivceRefreshTokenUseCase>(UsersSerivceRefreshTokenUseCase)
        jwtHandleService = module.get<JwtHandlerService>(JwtHandlerService)

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

        let userFromDb = await usersRepo.ReadManyCertainByLoginByEmail(user.login, user.email);
        expect(userFromDb).not.toBeUndefined();
    })

    it('Login and refreshToken doesnt create another device', async () => {
        await usersRepo.DeleteAll();

        let user = new UserControllerRegistrationEntity("someLogin", "some@mail.com", "1233123");
        let device = new RequestDeviceEntity("somedev", "1312313213");

        let savedUser = await usersRepo.Create(user);
        savedUser.emailConfirmed = true;
        savedUser = await usersRepo.UpdateOne(savedUser);

        let registration = await loginUseCase.execute(new UsersServiceLoginCommand(user.login, user.password, device));

        let userFromDb = (await usersRepo.ReadManyCertainByLoginByEmail(user.login, user.email))[0] as UserRepoEntity;
        expect(userFromDb).not.toBeUndefined();

        let userDevices = await deviceRepo.ReadManyByUserId(userFromDb.id.toString())
        let usDev = userDevices[0];

        expect(userDevices.length).toEqual(1);
        expect(usDev).toMatchObject(device);

        let previousLoginTime = usDev.refreshTime;

        for (let a = 0; a < 5; a++) {
            registration = await loginUseCase.execute(new UsersServiceLoginCommand(user.login, user.password, device));
            userDevices = await deviceRepo.ReadManyByUserId(userFromDb.id.toString())

            expect(userDevices.length).toEqual(1);
            let curUsDev = userDevices[0];
            let currentTime = curUsDev.refreshTime;

            expect(userDevices[0]).toMatchObject(device);
            expect(currentTime.valueOf() - previousLoginTime.valueOf()).toBeGreaterThan(0);

            previousLoginTime = currentTime;
        }
    })
})