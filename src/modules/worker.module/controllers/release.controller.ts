import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { StyleguideService } from '../services/styleguide.service';

@Controller()
export class ReleaseController {
  @Inject()
  private styleguide: StyleguideService;

  @Get('/releases')
  releasesList(): string[] {
    return this.styleguide.getReleases();
  }

  @Get('/release/products')
  productsList(@Query('v') release: string): string[] {
    if (!release) throw new BadRequestException('v param is required');
    return Object.keys(this.styleguide.getProducts(release));
  }

  @Get(['/release/product/componenet/templates', '/templates'])
  templatesList(
    @Query('p') product: string,
    @Query('v') release: string,
    @Query('c') component: string,
  ): string[] {
    return this.styleguide.getExtraTemplatesForSingleComponent(
      product,
      release,
      component,
    );
  }
}
