import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as NodeCache from 'node-cache';
import { MessageTypes } from 'src/modules/cluster.module/services/messaging.service';

@Injectable()
export class CacheService {
  private static cache: NodeCache = new NodeCache();

  public static Cachable: (string?) => MethodDecorator = (
    _cacheKey?: string,
  ) => {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) => {
      const method = descriptor.value;
      descriptor.value = function (...args: any[]) {
        let cacheKey = _cacheKey || descriptor.value.name;
        cacheKey = `${cacheKey}.${args
          .map((arg) => JSON.stringify(arg))
          .join('.')}`;
        if (!CacheService.cache.get(cacheKey))
          CacheService.cache.set(cacheKey, method.apply(this, args));

        return CacheService.cache.get(cacheKey);
      };
    };
  };

  @OnEvent(MessageTypes.ClearCache)
  public clearAll(): void {
    CacheService.cache.flushAll();
  }
}

export const { Cachable } = CacheService;
