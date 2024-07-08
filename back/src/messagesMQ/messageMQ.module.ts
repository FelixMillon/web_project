import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MessageMQController } from './messageMQ.controller';
import { MessageMQService } from './messageMQ.service';
import { MessageMQProcessor } from './messageMQ.processor';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { MessageGateway } from './messageMQ.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'message-queue',
    }),
    forwardRef(() => DatabaseModule),
  ],
  controllers: [MessageMQController],
  providers: [MessageMQService, MessageMQProcessor, MessageGateway],
})
export class MessageMQModule {}
