import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullQueueService {
  constructor(@InjectQueue('message-queue') private readonly messageQueue: Queue) {}

  async addJob(data: any) {
    await this.messageQueue.add(data);
  }
}