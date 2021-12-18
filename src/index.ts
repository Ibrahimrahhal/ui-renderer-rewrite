import { NestFactory } from '@nestjs/core';
import { PrimaryModule } from './modules/primary.module';
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(PrimaryModule);
  await app.listen(3000);
}
bootstrap();
