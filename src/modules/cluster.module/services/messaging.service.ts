import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClusterService } from './cluster.service';

interface Message<T> {
  payload: T;
  type: string;
}

export const MessageTypes = {
  ClearCache: 'ClearCache',
};
@Injectable()
export class MessagingService implements OnApplicationBootstrap {
  @Inject()
  private eventEmitter: EventEmitter2;

  @Inject()
  private cluster: ClusterService;

  public readConfig(key: string): string | undefined {
    return process.env[key];
  }

  public onApplicationBootstrap(): void {
    this.subscribeToMessages();
  }

  public send<T>(type: string, payload: T) {
    const message: Message<T> = { type, payload };
    if (this.cluster.isPrimary)
      Object.values(this.cluster.workers).forEach((worker) =>
        worker.send(message),
      );
    else process.send(message);
  }

  private subscribeToMessages(): void {
    if (this.cluster.isPrimary)
      Object.values(this.cluster.workers).forEach((worker) =>
        worker.on('message', (m) => this.messageHandler(m as Message<any>)),
      );
    else process.on('message', (m) => this.messageHandler(m as Message<any>));
  }

  private messageHandler(message: Message<any>) {
    this.eventEmitter.emit(message.type, message.payload || {});
  }
}
