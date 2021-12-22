import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { PrimaryModule } from './modules/primary.module';
import { WorkerModule } from './modules/worker.module';
import { ClusterService } from './modules/cluster.module/services/cluster.service';
import { MessagingService } from './modules/cluster.module/services/messaging.service';
import { ConfigsService } from './modules/utils.module/services/configs.service';

(async () => {
  dotenv.config();
  if (ClusterService.isPrimary) {
    const primary = await NestFactory.create(PrimaryModule);
    await primary.init();
    primary.get(MessagingService).onApplicationBootstrap();
  } else {
    const worker = await NestFactory.create(WorkerModule);
    const configs = worker.get(ConfigsService);
    await worker.listen(configs.readConfig('PORT', 3000));
  }
})();
