import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullQueueService } from './bull-queue.service';
import { BullQueueProcessor } from './bull-queue.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  providers: [BullQueueService, BullQueueProcessor],
  exports: [BullQueueService],
})
export class BullQueueModule {}
