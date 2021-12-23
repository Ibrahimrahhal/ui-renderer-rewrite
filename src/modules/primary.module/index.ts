import { Module } from '@nestjs/common';
import { PrimaryService } from './services/primary.service';
import { ClusterModule } from '../cluster.module';
import { UtilsModule } from '../utils.module';
import { BroadCastService } from './services/broadcast.service';
@Module({
  imports: [ClusterModule, UtilsModule],
  controllers: [],
  providers: [PrimaryService, BroadCastService],
})
export class PrimaryModule {}
