import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClusterService } from 'src/modules/cluster.module/services/cluster.service';
import { ConfigsService } from 'src/modules/utils.module/services/configs.service';

@Injectable()
export class PrimaryService implements OnApplicationBootstrap  {

  @Inject()
  private readonly cluster: ClusterService;

  @Inject()
  private readonly configs: ConfigsService;

  onApplicationBootstrap() {
    const workerCounts = parseInt(this.configs.readConfig('PUG_THREADS', 1));
    this.cluster.isPrimary && this.cluster.createWorkers(workerCounts);
  }
}
