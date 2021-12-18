import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigsService {
    public readConfig(key: string, fallback?: any): string | undefined {
        return process.env[key] || fallback;
    }
}
