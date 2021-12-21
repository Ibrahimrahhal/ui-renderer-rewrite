import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { StyleGuideRenderService } from '../services/styleguide-render-service';

@Controller()
export class RenderController {
  @Inject()
  private readonly styleguideRenderer: StyleGuideRenderService;

  @Post('/')
  renderTemplate(
    @Query('f') filePathToRender: string,
    @Query('p') product: string,
    @Query('v') release: string,
    @Query('c') component: string,
    @Query('t') template: string = component,
    @Body() data: Object,
  ): string {
    this.validateRequiredParams(
      filePathToRender,
      product,
      release,
      template,
      component,
    );
    if (filePathToRender) {
      try {
        return this.styleguideRenderer.renderTemplateByPath(
          release,
          product,
          filePathToRender,
          data,
        );
      } catch (e) {
        console.log(e.toString());
        throw new NotFoundException();
      }
    }
  }

  private validateRequiredParams(
    filePathToRender: string,
    product: string,
    release: string,
    template: string,
    component: string,
  ): void {
    if (filePathToRender && (!product || !release))
      throw new BadRequestException('missing required params');
    if (!filePathToRender && (!component || !product || !release))
      throw new BadRequestException('missing required params');
  }
}
