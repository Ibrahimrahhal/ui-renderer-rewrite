import { Controller, Get } from '@nestjs/common';

@Controller()
export class CacheController {
  @Get('/version')
  rendererVersion(): string {
    return 'This action returns all cats';
  }

  @Get('/info')
  styleguideInfo(): string {
    return 'cleared';
  }
}
