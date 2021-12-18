import { Inject, Injectable } from '@nestjs/common';
import { ConfigsService } from 'src/modules/utils.module/services/configs.service';
import { FileSystemService } from 'src/modules/utils.module/services/filesystem.service';

@Injectable()
export class StyleguideService {

  @Inject()
  private configs: ConfigsService;

  @Inject()
  private filesystem: FileSystemService;

  public get releasesDirectory(): string {
      return this.configs.readConfig('STYLEGUIDE_DIR', this.filesystem.resolveFileRelativeToApp('./'));
  }

  public get releases(): string[] {
      if(!this.filesystem.fileExist(this.releasesDirectory)) return [];
      return this.filesystem.listFilesInDirectory(this.releasesDirectory).filter(d => {
          const fullPath = this.filesystem.resolveFullPath(this.releasesDirectory, d);
          return !d.startsWith(".") && this.filesystem.isDirectory(fullPath);
      })
  }

  public getReleaseProducts(release: string): string[] {
    return []
  }
}
