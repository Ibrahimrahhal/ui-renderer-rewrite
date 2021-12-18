import { Module } from '@nestjs/common';
import { CatsController } from './controllers/root.controller';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [],
})
export class WorkerModule {}
