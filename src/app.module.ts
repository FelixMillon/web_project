import { Module } from '@nestjs/common';
import { BullQueueModule } from './bull/bull.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/user.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { AppResolver } from './app.resolver';
import { MessageResolver } from './messages/message.resolver'
import { MessageService } from './messages/message.service';
import { ConversationResolver } from './conversations/conversation.resolver';
import { ConversationService } from './conversations/conversation.service';
import { UserResolver } from './users/user.resolver';
import { UserService } from './users/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    UsersModule,
    RedisModule,
    AuthModule,
    GraphqlModule,
    BullQueueModule,
    HealthCheckModule
  ],
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
