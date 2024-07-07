import { Module } from '@nestjs/common';
import { HealthCheckController } from './healthCheck.controller';
import { HealthCheckService } from './healthCheck.service';
import { BullQueueModule } from '../bull/bull.module';

@Module({
  imports: [BullQueueModule],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
  exports: [HealthCheckService],
})
export class HealthCheckModule {}
