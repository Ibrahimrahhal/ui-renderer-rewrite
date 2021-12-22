import { Module } from '@nestjs/common';
import { ConfigsService } from './services/configs.service';
import { FileSystemService } from './services/filesystem.service';
import { GenericService } from './services/generic.service';
import { GlobalsService } from './services/globals.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ConfigsService,
    FileSystemService,
    GenericService,
    GlobalsService,
  ],
  exports: [ConfigsService, FileSystemService, GenericService, GlobalsService],
})
export class UtilsModule {}
