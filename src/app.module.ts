import { Module } from '@nestjs/common';
import { BullQueueModule } from './bull/bull.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { AppResolver } from './app.resolver';

@Module({
  imports: [GraphqlModule, BullQueueModule, HealthCheckModule],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
