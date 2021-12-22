import * as pug from 'jade';
import { Inject, Injectable } from '@nestjs/common';
import { Renderer } from '../types/renderer';
import { FileSystemService } from 'src/modules/utils.module/services/filesystem.service';
import { Global } from 'src/modules/utils.module/services/globals.service';

@Injectable()
export class PugRendererService implements Renderer {
  @Inject()
  public readonly filesystem: FileSystemService;

  public render(templatePath: string, data: Object): string {
    const pugTemplate: string = this.filesystem.readFile(templatePath);
    return pug.compile(pugTemplate)(data);
  }

  @Global('pb.renderDropzone')
  private renderDropZone(
    thisWidget: Object,
    name: string,
    desc?: string,
  ): string {
    return `<div class="pb-dropzone" data-pb-dropzone="${name}" title="${
      desc || name
    }"></div>`;
  }
}
