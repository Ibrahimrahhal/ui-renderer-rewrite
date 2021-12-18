import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagingService {
    public readConfig(key: string): string | undefined {
        return process.env[key];
    }
}
