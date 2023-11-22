import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";


export type UserRegistrationLoad = {
    id: number
}

export class JwtServiceGenerateRegistrationCodeCommand {
    constructor(public userRegistrationDto: UserRegistrationLoad) { }
}



@Injectable()
@CommandHandler(JwtServiceGenerateRegistrationCodeCommand)
export class JwtServiceGenerateRegistrationCodeUseCase implements ICommandHandler<JwtServiceGenerateRegistrationCodeCommand, string>{

    constructor(private jwtService: JwtService) { }

    async execute(command: JwtServiceGenerateRegistrationCodeCommand): Promise<string> {
        let tokenLoad = command.userRegistrationDto;
        let token = await this.jwtService.signAsync(tokenLoad);

        return token;
    }

}