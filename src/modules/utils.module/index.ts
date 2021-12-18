import { Module } from '@nestjs/common';
import { ConfigsService } from './services/configs.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigsService],
  exports: [ConfigsService]
})
export class UtilsModule {}
