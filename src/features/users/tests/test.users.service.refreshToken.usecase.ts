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

    it(`${UsersServiceLoginUseCase.name} refreshToken doesnt create new devices`, async () => {
        await usersRepo.DeleteAll();
        let allUsers = await usersRepo.ReadAll();
        expect(allUsers.length).toEqual(0);

        await deviceRepo.DeleteAll();
        let allDevices = await deviceRepo.ReadAll();
        expect(allDevices.length).toEqual(0);

        
        let user = new UserControllerRegistrationEntity("someLogin", "some@mail.com", "1233123");
        let userDevice = new RequestDeviceEntity("somedev", "1312313213");

        let savedUser = await usersRepo.Create(user);
        savedUser.emailConfirmed = true;
        savedUser = await usersRepo.UpdateOne(savedUser);
        expect(savedUser.login).toEqual(user.login);


        let registration = await loginUseCase.execute(new UsersServiceLoginCommand(user.login, user.password, userDevice));
        let decodedRefreshJwt = await jwtHandleService.ReadRefreshToken(registration.refreshToken);

        let refreshUser = await refreshUseCase.execute(new UsersSerivceRefreshTokenCommand(decodedRefreshJwt, userDevice));

        let savedUserDevices = await deviceRepo.ReadManyByUserId(savedUser.id.toString())

        expect(savedUserDevices.length).toEqual(1);
        expect(savedUserDevices[0]).toMatchObject(userDevice);

        for (let i = 0; i < 10; i++) {
            decodedRefreshJwt = await jwtHandleService.ReadRefreshToken(refreshUser.refreshToken);
            refreshUser = await refreshUseCase.execute(new UsersSerivceRefreshTokenCommand(decodedRefreshJwt, userDevice));

            savedUserDevices = await deviceRepo.ReadManyByUserId(savedUser.id.toString())

            expect(savedUserDevices.length).toEqual(1);
            expect(savedUserDevices[0]).toMatchObject(userDevice);
        }
    })
})