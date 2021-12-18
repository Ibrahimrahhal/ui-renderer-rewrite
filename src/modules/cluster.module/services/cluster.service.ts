import { Injectable } from '@nestjs/common';
import { Worker } from 'cluster';
import * as cluster from 'cluster';

@Injectable()
export class ClusterService {
    
    constructor() { }

    private static get cluster(): typeof cluster.default {
        return cluster as any;
    }

    private get cluster(): typeof cluster.default {
        return ClusterService.cluster;
    }

    public static get isPrimary(): boolean {
        return this.cluster.isPrimary;
    }
    
    public get isPrimary(): boolean {
        return ClusterService.isPrimary;
    }

    public get workers(): {[key: string]: Worker} {
        return this.cluster.workers;
    }

    public createWorkers(count: number): void {
        Array(count).fill(0).forEach(() => {
            let worker = this.cluster.fork();
        });
    }
}
