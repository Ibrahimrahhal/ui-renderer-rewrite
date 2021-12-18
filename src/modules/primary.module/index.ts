import { Module } from '@nestjs/common';
import { PrimaryController } from './controllers/primary.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [PrimaryController],
  providers: [AppService],
})
export class PrimaryModule {}
