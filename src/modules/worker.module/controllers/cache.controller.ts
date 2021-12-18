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
  clearCache(): void {
    this.messaging.send<void>(MessageTypes.ClearCache, null);
  }

  @Get('/refreshProducts')
  clearProductsListCache(): string {
    return 'cleared';
  }
}
