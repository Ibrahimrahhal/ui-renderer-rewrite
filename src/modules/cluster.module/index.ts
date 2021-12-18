import { Module } from '@nestjs/common';
import { MessagingService } from './services/messaging.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MessagingService],
  exports: [MessagingService]
})
export class ClusterModule {}
