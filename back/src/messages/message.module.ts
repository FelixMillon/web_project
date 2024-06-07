import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { BullQueueModule } from '../bull/bull.module';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    BullQueueModule,
    UserModule,
    forwardRef(() => DatabaseModule),
  ],
  providers: [MessageService, MessageResolver],
})
export class MessagesModule {}
