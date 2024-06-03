import { Module } from '@nestjs/common';
import { BullQueueModule } from './bull/bull.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './healthCheck/healthCheck.module';

@Module({
  imports: [BullQueueModule, HealthCheckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
