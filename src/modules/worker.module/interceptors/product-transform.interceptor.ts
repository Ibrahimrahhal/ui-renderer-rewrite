import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { StyleguideService } from '../services/styleguide.service';

@Injectable()
export class ProductTransformInterceptor implements NestInterceptor {
  @Inject()
  private readonly styleguide: StyleguideService;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const product = request.query['p'] as string;
    const release = request.query['v'] as string;
    if (release && product && !product.includes('/'))
      request.query['p'] = (this.styleguide.getProducts(release)[product] || '').split('ui-products/')[1] || '';
    return next.handle();
  }
}
