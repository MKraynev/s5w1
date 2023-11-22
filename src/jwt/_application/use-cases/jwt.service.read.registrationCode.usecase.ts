import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserRegistrationLoad } from "./jwt.service.generate.registrationCode.usecase";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export class JwtServiceReadRegistrationCodeCommand {

    constructor(public regisstrationCode: string) { }
}

@Injectable()
@CommandHandler(JwtServiceReadRegistrationCodeCommand)
export class JwtServiceReadRegistrationCodeUseCase implements ICommandHandler<JwtServiceReadRegistrationCodeCommand, UserRegistrationLoad>{

    constructor(private jwtService: JwtService) { }

    async execute(command: JwtServiceReadRegistrationCodeCommand): Promise<UserRegistrationLoad> {
        let tokenLoad: UserRegistrationLoad = await this.jwtService.verifyAsync(command.regisstrationCode);

        return tokenLoad;
    }

}