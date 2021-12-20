import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Query,
  Response,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { GenericService } from 'src/modules/utils.module/services/generic.service';
import { StaticFilesService } from '../services/static-files.service';
import { StyleguideService } from '../services/styleguide.service';

@Controller()
export class RootController {
  @Inject()
  private readonly genericService: GenericService;

  @Inject()
  private readonly staticFilesService: StaticFilesService;

  @Inject()
  private readonly styleguide: StyleguideService;

  @Get('/')
  handleRootRoute(
    @Response() response: Res,
    @Query('r') resource?: string,
    @Query('p') product?: string,
    @Query('v') release?: string,
    @Query('e') compression?: string,
    @Query('c') component?: string,
    @Query('t') template?: string,
  ): void {
    let subRouteResponse: RootRouteSubControllerResponse<any>;
    if (release && product && resource)
      subRouteResponse = this.handleGetStaticFileSubRoute(
        release,
        product,
        resource,
        compression,
      );
    else if (compression && component && product && release)
      subRouteResponse = this.handleGetTemplateFileSubRout(
        release,
        product,
        component,
        template,
      );
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

  private handleGetStaticFileSubRoute(
    release: string,
    product: string,
    file: string,
    compression: string,
  ): RootRouteSubControllerResponse<string> {
    const fileToRetrieve = this.staticFilesService.get(
      release,
      product,
      file,
      compression as any,
    );
    if (!Boolean(fileToRetrieve.path)) throw new NotFoundException();
    return {
      headers: {
        'Content-Type': fileToRetrieve.type,
        'Cache-Control': fileToRetrieve.isFingerPrinted
          ? 'public, max-age=604800'
          : 'no-store',
      },
      expressHandlerName: 'sendFile',
      response: fileToRetrieve.path,
    };
  }

  private handleGetTemplateFileSubRout(
    release: string,
    product: string,
    component: string,
    template: string,
  ): RootRouteSubControllerResponse<string> {
    const templateFile = this.styleguide.getTemplatePath(
      release,
      product,
      component,
      template,
    );
    if (!Boolean(templateFile)) throw new NotFoundException();
    return {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Resource-Path': templateFile,
      },
      expressHandlerName: 'sendFile',
      response: templateFile,
    };
  }
}

interface RootRouteSubControllerResponse<T> {
  headers: { [key: string]: string };
  expressHandlerName: string;
  response: T;
}
