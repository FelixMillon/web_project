import { Module } from '@nestjs/common';
import { BullQueueModule } from './bull/bull.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { AppResolver } from './app.resolver';
import { MessageResolver } from './messages/message.resolver'
import { MessageService } from './messages/message.service';
import { UserResolver } from './users/user.resolver'
import { UserService } from './users/user.service';
import { ConversationResolver } from './conversations/conversation.resolver'
import { ConversationService } from './conversations/conversation.service';

@Module({
  imports: [GraphqlModule, BullQueueModule, HealthCheckModule],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    MessageService,
    MessageResolver,
    UserService,
    UserResolver,
    ConversationService,
    ConversationResolver
  ],
})
export class AppModule {}
