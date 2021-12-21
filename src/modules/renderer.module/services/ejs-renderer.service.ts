import { Injectable } from '@nestjs/common';
import { Renderer } from '../types/renderer';

@Injectable()
export class EjsRendererService implements Renderer {
  public render(templatePath: string, data: Object): string {
    return '';
  }
}
