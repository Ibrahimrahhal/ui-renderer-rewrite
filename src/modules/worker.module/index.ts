import { ClusterModule } from './../cluster.module/index';
import { Module } from '@nestjs/common';
import { CacheController } from './controllers/cache.controller';
import { CatsController } from './controllers/root.controller';

@Module({
  imports: [ClusterModule],
  controllers: [CatsController, CacheController],
  providers: [],
})
export class WorkerModule {}
