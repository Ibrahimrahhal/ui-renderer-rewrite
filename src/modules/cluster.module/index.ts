import { Module } from '@nestjs/common';
import { MessagingService } from './services/messaging.service';
import { ClusterService } from './services/cluster.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [],
  providers: [MessagingService, ClusterService],
  exports: [MessagingService, ClusterService, EventEmitterModule],
})
export class ClusterModule {}
