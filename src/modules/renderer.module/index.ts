import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils.module';
import { AbstractRendererService } from './services/abstract-renderer.service';
import { EjsRendererService } from './services/ejs-renderer.service';
import { PugRendererService } from './services/pug-renderer.service';

@Module({
  imports: [UtilsModule],
  controllers: [],
  providers: [AbstractRendererService, EjsRendererService, PugRendererService],
  exports: [AbstractRendererService],
})
export class RendererModule {}
