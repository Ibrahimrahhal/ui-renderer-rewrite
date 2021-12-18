import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClusterService } from 'src/modules/cluster.module/services/cluster.service';
import { MessageTypes } from 'src/modules/cluster.module/services/messaging.service';
import { ConfigsService } from 'src/modules/utils.module/services/configs.service';

@Injectable()
export class PrimaryService implements OnApplicationBootstrap {
  @Inject()
  private readonly cluster: ClusterService;

  @Inject()
  private readonly configs: ConfigsService;

  onApplicationBootstrap() {
    const workerCounts = parseInt(this.configs.readConfig('PUG_THREADS', 1));
    this.cluster.createWorkers(workerCounts);
  }

  @OnEvent(MessageTypes.ClearCache)
  clear(p) {
    console.log('asdaspodkasopdkaspo');
  }
}
