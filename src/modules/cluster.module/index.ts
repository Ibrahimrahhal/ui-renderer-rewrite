import { Module } from '@nestjs/common';
import { MessagingService } from './services/messaging.service';
import { ClusterService } from './services/cluster.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MessagingService, ClusterService],
  exports: [MessagingService, ClusterService]
})
export class ClusterModule {}
