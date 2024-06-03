import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql/graphql.module';
import { BullQueueModule } from './bull/bull.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { AppResolver } from './app.resolver';
import { MessageResolver } from './resolvers/message.resolver';

@Module({
  imports: [GraphqlModule, BullQueueModule, HealthCheckModule],
  controllers: [AppController],
  providers: [AppService, AppResolver, MessageResolver],
})
export class AppModule {}
