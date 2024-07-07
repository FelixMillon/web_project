import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { SendedMessage} from '../types'
@Injectable()
export class MessageMQService {
  constructor(@InjectQueue('message-queue') private messageQueue: Queue) {}

  async publishMessage(message: SendedMessage) {
    await this.messageQueue.add('message-job', { message });
    console.log("published")
  }
}
