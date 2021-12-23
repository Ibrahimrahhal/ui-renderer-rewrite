import { Inject, Injectable } from '@nestjs/common';
import { FileSystemService } from './filesystem.service';
import { Global } from './globals.service';

@Injectable()
export class GenericService {
  @Inject()
  private filesystem: FileSystemService;

  private appPackageJSON: any;

  public get appInfo(): AppicationInfo {
    if (!this.appPackageJSON) {
      const packageJSONPath =
        this.filesystem.resolveFileRelativeToApp('package.json');
      this.appPackageJSON = JSON.parse(
        this.filesystem.readFile(packageJSONPath),
      );
    }
    return this.appPackageJSON;
  }

  @Global('pb.updateParam')
  public updateParam(uri: string, key: string, value: string): string {
    let re = new RegExp('([?&])' + key + '=.*?(&|#|$)', 'i');
    if (value === undefined) {
      if (uri.match(re)) {
        return uri.replace(re, '$1$2');
      } else {
        return uri;
      }
    } else {
      if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + value + '$2');
      } else {
        let hash = '';
        if (uri.indexOf('#') !== -1) {
          hash = uri.replace(/.*#/, '#');
          uri = uri.replace(/#.*/, '');
        }
        let separator = uri.indexOf('?') !== -1 ? '&' : '?';
        return uri + separator + key + '=' + value + hash;
      }
    }
  }

  @Global('pb.formatNumber')
  public formatNumber(_number: number, separator: string): string {
    if (typeof separator === 'undefined') {
      separator = ',';
    }
    try {
      const number = _number
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return number;
    } catch (err) {
      throw new Error('Error formatting number');
    }
  }
}

interface AppicationInfo {
  version: string;
}
