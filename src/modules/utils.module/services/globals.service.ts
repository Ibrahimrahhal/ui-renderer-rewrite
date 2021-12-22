import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalsService {
  public static extraGlobals: { [key: string]: any } = {};
}

export const Global = (name: string): MethodDecorator => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    GlobalsService.extraGlobals[name] = descriptor.value;
    let targetObject = global;
    let propertyPath = name.split('.');
    let property = propertyPath.pop();
    while (propertyPath.length > 0) {
      if (!targetObject[propertyPath[0]]) targetObject[propertyPath[0]] = {};
      targetObject = targetObject[propertyPath[0]];
      propertyPath.shift();
    }
    targetObject[property] = descriptor.value;
  };
};
