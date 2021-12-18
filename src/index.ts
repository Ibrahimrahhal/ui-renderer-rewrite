import { NestFactory } from '@nestjs/core';
import { PrimaryModule } from './modules/primary.module';
import { WorkerModule } from './modules/worker.module';
import { ClusterService } from './modules/cluster.module/services/cluster.service';
import { PrimaryService } from './modules/primary.module/services/primary.service';

(async () => {
  if (ClusterService.isPrimary) {
    const primary = await NestFactory.create(PrimaryModule);
    primary.get(PrimaryService).onApplicationBootstrap();
  } else {
    const worker = await NestFactory.create(WorkerModule);
    await worker.listen(3000);
  }
})();
