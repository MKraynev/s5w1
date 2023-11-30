import { UserLoginStatus, UsersServiceLoginCommand, UsersServiceLoginUseCase } from "../use-cases/users.service.login.usecase";
import { TestUsersServiceTestingModule } from "./settings/users.service.testingModule";
import { TestingModule } from "@nestjs/testing";
import { UserControllerRegistrationEntity } from "../controllers/entities/users.controller.registration.entity";
import { UsersRepoService } from "src/repo/users/users.repo.service";
import { RequestDeviceEntity } from "src/common/decorators/requestedDeviceInfo/entity/request.device.entity";
import { DeviceRepoService } from "src/repo/devices/devices.repo.service";
import { UsersSerivceRefreshTokenCommand, UsersSerivceRefreshTokenUseCase } from "../use-cases/users.service.refreshToken.usecase";
import { JwtHandlerService } from "src/auth/jwt/jwt.service";
import { UsersServiceLogoutCommand, UsersServiceLogoutUseCase } from "../use-cases/users.service.logout.usecase";

describe(`${UsersServiceLoginUseCase.name} test`, () => {
    let module: TestingModule;

    let usersRepo: UsersRepoService;
    let deviceRepo: DeviceRepoService;
    let loginUseCase: UsersServiceLoginUseCase;
    let refreshUseCase: UsersSerivceRefreshTokenUseCase;
    let logoutUseCase: UsersServiceLogoutUseCase;
    let jwtHandleService: JwtHandlerService;

    beforeAll(async () => {
        module = await TestUsersServiceTestingModule.compile();

        await module.init();

        usersRepo = module.get<UsersRepoService>(UsersRepoService);
        deviceRepo = module.get<DeviceRepoService>(DeviceRepoService)
        loginUseCase = module.get<UsersServiceLoginUseCase>(UsersServiceLoginUseCase)
        refreshUseCase = module.get<UsersSerivceRefreshTokenUseCase>(UsersSerivceRefreshTokenUseCase)
        logoutUseCase = module.get<UsersServiceLogoutUseCase>(UsersServiceLogoutUseCase)
        jwtHandleService = module.get<JwtHandlerService>(JwtHandlerService)

    })

    afterAll(async () => {
        await module.close();
    })

    it(`${UsersServiceLoginUseCase.name} logout decrease user devices`, async () => {
        await usersRepo.DeleteAll();

        let user = new UserControllerRegistrationEntity("someLogin", "some@mail.com", "1233123");
        let userDevice_1 = new RequestDeviceEntity("somedev", "1312313213");
        let userDevice_2 = new RequestDeviceEntity("somedev_2", "2222222");
        let userDevice_3 = new RequestDeviceEntity("somedev_3", "3333333");
        let userDevice_4 = new RequestDeviceEntity("somedev_4", "4444444");
        

        let savedUser = await usersRepo.Create(user);
        savedUser.emailConfirmed = true;
        savedUser = await usersRepo.UpdateOne(savedUser);
        expect(savedUser.login).toEqual(user.login);


        let registration_1 = await loginUseCase.execute(new UsersServiceLoginCommand(user.login, user.password, userDevice_1));
        let registration_2 = await loginUseCase.execute(new UsersServiceLoginCommand(user.login, user.password, userDevice_2));
        let registration_3 = await loginUseCase.execute(new UsersServiceLoginCommand(user.login, user.password, userDevice_3));
        let registration_4 = await loginUseCase.execute(new UsersServiceLoginCommand(user.login, user.password, userDevice_4));
        

        let savedUserDevices = await deviceRepo.ReadManyByUserId(savedUser.id.toString())

        expect(savedUserDevices.length).toEqual(4);
        expect(savedUserDevices[0]).toMatchObject(userDevice_1);
        expect(savedUserDevices[1]).toMatchObject(userDevice_2);
        expect(savedUserDevices[2]).toMatchObject(userDevice_3);
        expect(savedUserDevices[3]).toMatchObject(userDevice_4);

        let decodedToken = await jwtHandleService.ReadRefreshToken(registration_4.refreshToken);
        let logout = await logoutUseCase.execute(new UsersServiceLogoutCommand(userDevice_4, decodedToken))
        savedUserDevices = await deviceRepo.ReadManyByUserId(savedUser.id.toString())
        expect(savedUserDevices.length).toEqual(3);
        expect(savedUserDevices[0]).toMatchObject(userDevice_1);
        expect(savedUserDevices[1]).toMatchObject(userDevice_2);
        expect(savedUserDevices[2]).toMatchObject(userDevice_3);


        decodedToken = await jwtHandleService.ReadRefreshToken(registration_1.refreshToken);
        logout = await logoutUseCase.execute(new UsersServiceLogoutCommand(userDevice_1, decodedToken))
        savedUserDevices = await deviceRepo.ReadManyByUserId(savedUser.id.toString())
        expect(savedUserDevices.length).toEqual(2);
        expect(savedUserDevices[0]).toMatchObject(userDevice_2);
        expect(savedUserDevices[1]).toMatchObject(userDevice_3);

        decodedToken = await jwtHandleService.ReadRefreshToken(registration_2.refreshToken);
        let refreshToken = await refreshUseCase.execute(new UsersSerivceRefreshTokenCommand(decodedToken, userDevice_2));

        decodedToken = await jwtHandleService.ReadRefreshToken(refreshToken.refreshToken);
        logout = await logoutUseCase.execute(new UsersServiceLogoutCommand(userDevice_2, decodedToken))
        savedUserDevices = await deviceRepo.ReadManyByUserId(savedUser.id.toString())
        expect(savedUserDevices.length).toEqual(1);
        expect(savedUserDevices[0]).toMatchObject(userDevice_3);

    })
})