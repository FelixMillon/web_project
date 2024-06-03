import { Injectable } from '@nestjs/common';
import { BullQueueService } from '../bull/bull-queue.service';

@Injectable()
export class HealthCheckService {
  constructor(private readonly bullQueueService: BullQueueService) {}

  getHealth(): string {
    // Add a job to the queue
    this.bullQueueService.addJob({ message: 'Health check job' });
    return 'OK';
  }
}
