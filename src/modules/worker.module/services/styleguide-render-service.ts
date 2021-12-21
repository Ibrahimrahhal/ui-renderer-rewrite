import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractRendererService } from 'src/modules/renderer.module/services/abstract-renderer.service';
import { Renderer } from 'src/modules/renderer.module/types/renderer';
import { FileSystemService } from 'src/modules/utils.module/services/filesystem.service';
import { StyleguideService } from './styleguide.service';

@Injectable()
export class StyleGuideRenderService {
  @Inject()
  private readonly styleguide: StyleguideService;
  @Inject()
  private readonly renderer: AbstractRendererService;

  @Inject()
  private readonly filesystem: FileSystemService;

  public renderTemplateByPath(
    release: string,
    product: string,
    _templatePath: string,
    data: Object,
  ): string {
    const templatePath = this.filesystem.resolveFullPath(
      this.styleguide.getProductPathForRelease(release, product),
      `./${_templatePath}`,
    );
    console.log(templatePath);
    if (!this.filesystem.fileExist(templatePath)) throw new Error();
    return (
      this.renderer[this.getTemplateType(templatePath)] as Renderer
    ).render(templatePath, data);
  }

  private getTemplateType(path: string): 'pug' | 'ejs' {
    if (path.endsWith('.ejs')) return 'ejs';
    return 'pug';
  }
}
