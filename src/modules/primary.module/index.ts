import { Module } from '@nestjs/common';
import { PrimaryService } from './services/primary.service';
import { ClusterModule } from '../cluster.module';
import { UtilsModule } from '../utils.module';
@Module({
  imports: [ClusterModule, UtilsModule],
  controllers: [],
  providers: [PrimaryService],
})
export class PrimaryModule {}
