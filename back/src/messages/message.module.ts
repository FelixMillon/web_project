import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { BullQueueModule } from '../bull/bull.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [BullQueueModule, UserModule],
  providers: [MessageService, MessageResolver],
})
export class MessagesModule {}
