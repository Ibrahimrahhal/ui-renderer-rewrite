import {
  MessageTypes,
  MessagingService,
} from './../../cluster.module/services/messaging.service';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller()
export class CacheController {
  @Inject()
  private messaging: MessagingService;

  @Get('/invalidateCaches')
  clearCache(): string {
    this.messaging.send<void>(MessageTypes.ClearCache, null);
    return 'ijjias';
  }

  @Get('/refreshProducts')
  clearProductsListCache(): string {
    return 'cleared';
  }
}
