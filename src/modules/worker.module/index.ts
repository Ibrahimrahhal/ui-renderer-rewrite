import { ClusterModule } from './../cluster.module/index';
import { Module } from '@nestjs/common';
import { CacheController } from './controllers/cache.controller';
import { InfoController } from './controllers/info.controller';
import { UtilsModule } from '../utils.module';
import { StyleguideService } from './services/styleguide.service';
import { ReleaseController } from './controllers/release.controller';
import { RootController } from './controllers/root.controller';
import { StaticFilesService } from './services/static-files.service';

@Module({
  imports: [ClusterModule, UtilsModule],
  controllers: [
    InfoController,
    CacheController,
    ReleaseController,
    RootController,
  ],
  providers: [StyleguideService, StaticFilesService],
})
export class WorkerModule {}
