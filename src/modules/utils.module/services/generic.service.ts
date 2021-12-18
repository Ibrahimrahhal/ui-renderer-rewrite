import { Inject, Injectable } from '@nestjs/common';
import { FileSystemService } from './filesystem.service';

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
}

interface AppicationInfo {
  version: string;
}
