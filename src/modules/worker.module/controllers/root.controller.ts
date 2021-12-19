import { Controller, Get, Inject, Query, Response } from '@nestjs/common';
import { Response as Res } from 'express';
import { GenericService } from 'src/modules/utils.module/services/generic.service';

@Controller()
export class RootController {
  @Inject()
  private genericService: GenericService;

  @Get('/')
  handleRootRoute(
    @Response() response: Res,
    @Query('r') resource?: string,
    @Query('p') product?: string,
    @Query('v') release?: string,
    @Query('e') ext?: string,
    @Query('c') component?: string,
  ): void {
    let subRouteResponse: RootRouteSubControllerResponse<any>;
    if (release && product && resource) console.log('static file');
    else if (ext && component && product && release)
      console.log('ass template');
    else subRouteResponse = this.handleVersionSubRout();
    response
      .set(subRouteResponse.headers)
      [subRouteResponse.expressHandlerName](subRouteResponse.response);
    return;
  }

  private handleVersionSubRout(): RootRouteSubControllerResponse<string> {
    const { version } = this.genericService.appInfo;
    return {
      headers: {},
      expressHandlerName: 'send',
      response: `Styleguide Renderer ${version}`,
    };
  }
}

interface RootRouteSubControllerResponse<T> {
  headers: { [key: string]: string };
  expressHandlerName: string;
  response: T;
}
