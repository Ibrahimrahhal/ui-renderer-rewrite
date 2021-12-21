import { Inject, Injectable } from '@nestjs/common';
import { EjsRendererService } from './ejs-renderer.service';
import { PugRendererService } from './pug-renderer.service';

@Injectable()
export class AbstractRendererService {
  @Inject()
  public readonly pug: PugRendererService;

  @Inject()
  public readonly ejs: EjsRendererService;
}
