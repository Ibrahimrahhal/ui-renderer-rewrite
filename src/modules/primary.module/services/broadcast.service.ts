import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageTypes,
  MessagingService,
} from 'src/modules/cluster.module/services/messaging.service';

@Injectable()
export class BroadCastService {

  @Inject()
  private readonly messaging: MessagingService;


  @OnEvent(MessageTypes.ClearCache)
  broadcastClearCache(message) {
      this.messaging.send<void>(MessageTypes.ClearCache, null);
    }
}
