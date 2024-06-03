import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Message } from '../models/message.model';

@Processor('message-queue')
export class BullQueueProcessor {
  @Process()
  async handleJob(job: Job) {
    const message: Message = job.data.message;
    console.log('Processing message job', job.id, 'with data', message);

    // memory storage
    messages.push(message);
  }
}

const messages: Message[] = [];
