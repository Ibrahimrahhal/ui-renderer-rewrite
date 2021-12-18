import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigsService {
    public readConfig(key: string): string | undefined {
        return process.env[key];
    }
}
