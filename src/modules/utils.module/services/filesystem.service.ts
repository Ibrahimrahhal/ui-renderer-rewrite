import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileSystemService {
  public readFile(path: string): string {
    return fs.readFileSync(path, 'utf8');
  }

  public resolveFileRelativeToApp(relativePath: string): string {
    return path.resolve(__dirname, '../../../../', relativePath);
  }

  public listFilesInDirectory(path: string): string[] {
    return fs.readdirSync(path);
  }

  public fileExist(path: string): boolean {
    return fs.existsSync(path);
  }

  public isDirectory(path: string): boolean {
    try {
      return fs.statSync(path).isDirectory();
    } catch {
      return false;
    }
  }

  public resolveRealPath(path: string): string {
    return fs.realpathSync(path);
  }

  public resolveFullPath(...relativePath: string[]): string {
    return path.resolve(...relativePath);
  }
}
