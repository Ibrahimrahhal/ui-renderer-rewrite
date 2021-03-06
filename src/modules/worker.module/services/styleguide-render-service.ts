import { Inject, Injectable } from '@nestjs/common';
import { AbstractRendererService } from 'src/modules/renderer.module/services/abstract-renderer.service';
import { FileSystemService } from 'src/modules/utils.module/services/filesystem.service';
import { Global } from 'src/modules/utils.module/services/globals.service';
import { StyleguideService } from './styleguide.service';

@Injectable()
export class StyleGuideRenderService {
  @Inject()
  private readonly styleguide: StyleguideService;
  @Inject()
  private readonly renderer: AbstractRendererService;
  @Inject()
  private readonly filesystem: FileSystemService;

  private activeProduct: string;
  private activeRelease: string;

  public setRenderContext(release: string, product: string): void {
    this.activeRelease = release;
    this.activeProduct = product;
  }
  
  public renderByPath(
    release: string,
    product: string,
    _templatePath: string,
    data: Object,
  ): string {
    const templatePath = this.filesystem.resolveFullPath(
      this.styleguide.getProductPathForRelease(release, product),
      `./${_templatePath}`,
    );
    if (!this.filesystem.fileExist(templatePath)) throw new Error('not-found');
    return this.renderer.render(templatePath, data);
  }

  public render(
    release: string,
    product: string,
    component: string,
    template: string,
    data: Object,
  ): string {
    const templatePath = this.styleguide.getTemplatePath(
      release,
      product,
      component,
      template,
    );
    if (!templatePath) throw new Error('not-found');
    return this.renderer.render(templatePath, data);
  }

  @Global('pb.render')
  public handleWithInTemplateRenderCalls(...args: any[]): string {
    const { component, template, data, product, release } =
      this.getInTemplateRenderCallsParams(args);
    const templatePath = this.styleguide.getTemplatePath(
      release,
      product,
      component,
      template,
    );
    return this.renderer.render(templatePath, data);
  }

  private getInTemplateRenderCallsParams(args: any[] = []): {
    component: string;
    template: string;
    data?: Object;
    product: string;
    release: string;
  } {
    if (args.length < 1) throw new Error('pb.render(): Not enough arguments!');
    const argumentForms = [
      {
        desc: '(component, template)',
        test: (args: any[]) => {
          return (
            args.length === 2 &&
            typeof args[1] === 'string' &&
            args[1].indexOf('/') > -1
          );
        },
        extract: (args: any[]) => {
          return {
            component: args[0],
            template: args[1],
          };
        },
      },
      {
        desc: '(component, product)',
        test: (args: any[]) => {
          return (
            args.length === 2 &&
            typeof args[1] === 'string' &&
            !(args[1].indexOf('/') > -1)
          );
        },
        extract: (args: any[]) => {
          return {
            component: args[0],
            product: args[1],
          };
        },
      },
      {
        desc: '(component, data)',
        test: (args: any[]) => {
          return args.length === 2 && typeof args[1] !== 'string';
        },
        extract: (args: any[]) => {
          return {
            component: args[0],
            data: args[1],
          };
        },
      },
      {
        desc: '(component, template, product)',
        test: (args: any[]) => {
          return (
            args.length === 3 &&
            typeof args[1] === 'string' &&
            typeof args[2] === 'string'
          );
        },
        extract: (args: any[]) => {
          return {
            component: args[0],
            template: args[1],
            product: args[2],
          };
        },
      },
      {
        desc: '(component, template, data)',
        test: (args: any[]) => {
          return (
            args.length === 3 &&
            typeof args[1] === 'string' &&
            typeof args[2] !== 'string'
          );
        },
        extract: (args: any[]) => {
          return {
            component: args[0],
            template: args[1],
            data: args[2],
          };
        },
      },
      {
        desc: '(component, data, product)',
        test: (args: any[]) => {
          return args.length === 3 && typeof args[1] !== 'string';
        },
        extract: (args: any[]) => {
          return {
            component: args[0],
            data: args[1],
            product: args[2],
          };
        },
      },
      {
        desc: ' (component, template, data, product)',
        test: (args: any[]) => {
          return args.length === 4;
        },
        extract: (args: any[]) => {
          return {
            component: args[0],
            template: args[1],
            data: args[2],
            product: args[3],
          };
        },
      },
    ];
    const result: {
      component: string;
      template?: string;
      data?: Object;
      product?: string;
      release?: string;
    } = argumentForms.find((f) => f.test(args)).extract(args);
    result.template = result.template || result.component;
    result.product = result.product || this.activeProduct;
    result.release = this.activeRelease;
    return result as any;
  }
}
