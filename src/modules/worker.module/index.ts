import { ClusterModule } from './../cluster.module/index';
import { Module } from '@nestjs/common';
import { CacheController } from './controllers/cache.controller';
import { InfoController } from './controllers/info.controller';
import { UtilsModule } from '../utils.module';
import { StyleguideService } from './services/styleguide.service';
import { ReleaseController } from './controllers/release.controller';
import { RootController } from './controllers/root.controller';
import { StaticFilesService } from './services/static-files.service';
import { RendererModule } from '../renderer.module';
import { RenderController } from './controllers/render.controller';
import { StyleGuideRenderService } from './services/styleguide-render-service';
import { CacheService } from './services/cache.service';

@Module({
  imports: [ClusterModule, UtilsModule, RendererModule],
  controllers: [
    InfoController,
    CacheController,
    ReleaseController,
    RootController,
    RenderController,
  ],
  providers: [CacheService, StyleguideService, StaticFilesService, StyleGuideRenderService],
})
export class WorkerModule {}
