import { Module } from '@nestjs/common';
import { ConfigsService } from './services/configs.service';
import { FileSystemService } from './services/filesystem.service';
import { GenericService } from './services/generic.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigsService, FileSystemService, GenericService],
  exports: [ConfigsService, FileSystemService, GenericService],
})
export class UtilsModule {}
