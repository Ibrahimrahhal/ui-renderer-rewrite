import { BadRequestException, Controller, Get, Inject, Query } from '@nestjs/common';
import { StyleguideService } from '../services/styleguide.service';

@Controller()
export class ReleaseController {
  
  @Inject()
  private styleguide: StyleguideService;

  @Get('/releases')
  releasesList(): string[] {
    return this.styleguide.releases;
  }

  @Get('/release/products')
  productsList(@Query('v') release): string {
    if(!release) throw new BadRequestException('v param is required');
    return 'cleared';
  }

  @Get(['/release/templates', '/templates'])
  templatesList(): string {
    return 'cleared';
  }
}
