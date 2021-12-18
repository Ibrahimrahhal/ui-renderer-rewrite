import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageTypes } from 'src/modules/cluster.module/services/messaging.service';

@Injectable()
export class CacheService {
  @OnEvent(MessageTypes.ClearCache)
  public clearAll() {}
}
