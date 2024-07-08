import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { SendedMessage} from '../types'
@Injectable()
export class MessageMQService {
  constructor(@InjectQueue('message-queue') private messageQueue: Queue) {}

  async publishMessage(message: SendedMessage) {
    await this.messageQueue.add('message-job', { message },{
      removeOnComplete: {
        age: 1,
        count: 100,
      },
      removeOnFail: {
        age: 24 * 3600,
      },
    },);
    console.log("published")
    
  }
}
