import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('message-queue')
export class BullQueueProcessor {
  @Process()
  async handleJob(job: Job) {
    console.log('Processing job', job.id, 'with data', job.data);
  }
}
