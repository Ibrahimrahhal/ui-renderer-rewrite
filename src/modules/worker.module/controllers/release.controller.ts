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
    return this.styleguide.releases;
  }

  @Get('/release/products')
  productsList(@Query('v') release): string[] {
    if (!release) throw new BadRequestException('v param is required');
    return Object.keys(this.styleguide.loadProducts(release));
  }

  @Get(['/release/product/componenet/templates', '/templates'])
  templatesList(
    @Query('p') product,
    @Query('v') release,
    @Query('c') component,
  ): string[] {
    return this.styleguide.getExtraTemplatesForSingleWidget(
      product,
      release,
      component,
    );
  }
}
