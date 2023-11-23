import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './settings';
import ngrok from "ngrok"
import cookieParser from 'cookie-parser';
export class Main {
  public ADDRES: string;

  public async Init() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.use(cookieParser())

    await app.listen(PORT);

    let url = await ngrok.connect();
    this.ADDRES = url;
    console.log(url);
  }
}

// export const CONFIRM_REGISTRATION_URL = await bootstrap() + "/auth/registration-confirmation";

export const _MAIN_ = new Main();
_MAIN_.Init();
