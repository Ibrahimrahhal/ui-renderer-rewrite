import { Controller, Get, GoneException, Inject, Query } from '@nestjs/common';
import { GenericService } from 'src/modules/utils.module/services/generic.service';

@Controller()
export class InfoController {
  @Inject()
  private genericService: GenericService;

  @Get('/version')
  rendererVersion(): { version: string } {
    const { version } = this.genericService.appInfo;
    return { version };
  }

  @Get('/info')
  styleguideInfo(
    @Query('p') product: string,
    @Query('v') release: string,
  ): string {
    throw new GoneException('styleguide.info is deprecated');
  }
}
