import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './message.resolver';
import { BullQueueModule } from '../bull/bull.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [BullQueueModule, UsersModule],
  providers: [MessagesService, MessagesResolver],
})
export class MessagesModule {}
