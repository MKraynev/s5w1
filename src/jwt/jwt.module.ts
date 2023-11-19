import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ACCESS_TOKEN_EXPIRE, JWT_SECRET } from "src/settings";


@Module({
    imports: [
        JwtModule.register({
        secret: JWT_SECRET,
        signOptions: { expiresIn: ACCESS_TOKEN_EXPIRE },
    })]
})
export class JwtGeneratorModule { }