import * as pug from 'pug';
import { Inject, Injectable } from '@nestjs/common';
import { Renderer } from '../types/renderer';
import { FileSystemService } from 'src/modules/utils.module/services/filesystem.service';

@Injectable()
export class PugRendererService implements Renderer {
  @Inject()
  public readonly filesystem: FileSystemService;

  public render(templatePath: string, data: Object): string {
    const pugTemplate: string = this.filesystem.readFile(templatePath);
    return pug.compile(pugTemplate)(data);
  }
}
