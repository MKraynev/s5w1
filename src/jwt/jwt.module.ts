import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET } from "src/settings";
import { JwtServiceGenerateRegistrationCodeUseCase } from "./_application/use-cases/jwt.service.generate.registrationCode.usecase";
import { JwtServiceReadRegistrationCodeUseCase } from "./_application/use-cases/jwt.service.read.registrationCode.usecase";


export const JwtServiceUseCases = [
    JwtServiceGenerateRegistrationCodeUseCase,
    JwtServiceReadRegistrationCodeUseCase
]

@Module({
    imports: [
        JwtModule.register({
            secret: JWT_SECRET
        })],
    providers: [...JwtServiceUseCases],
    exports: [...JwtServiceUseCases]
})
export class JwtGeneratorModule { }