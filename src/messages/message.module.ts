import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { BullQueueModule } from '../bull/bull.module';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [BullQueueModule, UsersModule],
  providers: [MessageService, MessageResolver],
})
export class MessagesModule {}
