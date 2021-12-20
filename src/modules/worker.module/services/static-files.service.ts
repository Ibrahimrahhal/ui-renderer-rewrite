import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FileSystemService } from 'src/modules/utils.module/services/filesystem.service';
import { StyleguideService } from './styleguide.service';

@Injectable()
export class StaticFilesService {
  @Inject()
  private readonly styleguide: StyleguideService;
  @Inject()
  private readonly filesystem: FileSystemService;
  private readonly fingerPrintRegex = new RegExp(
    '^([a-zA-Z.]+)(-[a-z0-9]+)..*(js|css)$',
    'g',
  );
  private readonly manifestFile: string = 'manifest.json';

  constructor() {}

  public get(
    release: string,
    product: string,
    _file: string,
    compressionType: 'br' | 'gz',
  ): StyleguideStaticFile {
    const productPath = this.styleguide.getProductPathForRelease(
      release,
      product,
    );
    const releasedAssetsPath = this.filesystem.resolveFullPath(
      productPath,
      './releasedAssets',
    );
    const file: string = compressionType
      ? `${_file}.${compressionType}`
      : _file;
    const isFileFingerPrinted = this.isFileFingerPrinted(file);
    const fileNoFingerPrint = isFileFingerPrinted
      ? this.removeFileFingerPrint(file)
      : file;
    let fileToRetrieve = this.filesystem.resolveFullPath(
      releasedAssetsPath,
      `./${
        this.getFullFileNameFromManifest(
          fileNoFingerPrint,
          releasedAssetsPath,
        ) ||
        this.getFullFileNameFromManifest(file, releasedAssetsPath) ||
        file
      }`,
    );
    if (!this.filesystem.fileExist(fileToRetrieve)) fileToRetrieve = '';
    return {
      path: fileToRetrieve,
      isFingerPrinted: isFileFingerPrinted,
      type: this.getMemeType(fileToRetrieve),
    };
  }

  private isFileFingerPrinted(filename: string): boolean {
    return this.fingerPrintRegex.test(filename);
  }

  private removeFileFingerPrint(filename: string): string {
    return (filename || '').replace(
      this.fingerPrintRegex.exec(filename)[2],
      '',
    );
  }

  private getFullFileNameFromManifest(
    filename: string,
    lookupfile: string,
  ): string {
    const fileInManifest: string = filename.split('/')[1];
    const type: string = filename.split('/')[0];
    const fileFromManifest = this.getFilesManifest(lookupfile)[fileInManifest];
    return fileFromManifest && `${type}/${fileFromManifest}`;
  }

  private getFilesManifest(lookupPath: string): { [file: string]: string } {
    const file = this.filesystem.resolveFullPath(
      lookupPath,
      `./${this.manifestFile}`,
    );
    try {
      return JSON.parse(this.filesystem.readFile(file));
    } catch (e) {
      return {};
    }
  }

  private getMemeType(file: string): string {
    const ext = file.split('.').reverse()[0];
    switch (ext) {
      case 'css':
        return 'text/css; charset=UTF-8';
      case 'js':
        return 'application/javascript';
      case 'ttf':
        return 'font/ttf';
      case 'woff':
        return 'font/woff';
      case 'eot':
        return 'application/vnd.ms-fontobject';
      case 'svg':
        return 'image/svg+xml; charset=UTF-8';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return 'text/plain; charset=UTF-8';
    }
  }
}

interface StyleguideStaticFile {
  path: string;
  isFingerPrinted: boolean;
  type: string;
}
