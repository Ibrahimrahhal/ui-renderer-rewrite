import { Controller, Get } from '@nestjs/common';

@Controller()
export class CacheController {
  @Get('/releases')
  releasesList(): string {
    return 'This action returns all cats';
  }

  @Get('/release/products')
  productsList(): string {
    return 'cleared';
  }

  @Get(['/release/templates', '/templates'])
  templatesList(): string {
    return 'cleared';
  }
}
