import { Inject, Injectable } from '@nestjs/common';
import { Renderer } from '../types/renderer';
import { EjsRendererService } from './ejs-renderer.service';
import { PugRendererService } from './pug-renderer.service';

@Injectable()
export class AbstractRendererService implements Renderer {
  @Inject()
  private readonly pug: PugRendererService;

  @Inject()
  private readonly ejs: EjsRendererService;

  private getTemplateType(path: string): 'pug' | 'ejs' {
    if (path.endsWith('.ejs')) return 'ejs';
    return 'pug';
  }

  public render(templatePath: string, data: Object): string {
    return (this[this.getTemplateType(templatePath)] as Renderer).render(
      templatePath,
      data,
    );
  }
}
