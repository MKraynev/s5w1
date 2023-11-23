import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET } from "src/settings";
import { JwtHandlerService } from "./jwt.service";

@Module({
    imports: [
        JwtModule.register({
            secret: JWT_SECRET
        })],
    providers: [JwtHandlerService],
    exports: [JwtHandlerService]
})
export class JwtHandlerModule { }