import { Module } from '@nestjs/common';
import { HealthCheckController } from './healthCheck.controller';
import { HealthCheckService } from './healthCheck.service';

@Module({
    controllers: [HealthCheckController],
    providers: [HealthCheckService],
    exports: [HealthCheckService],
})
export class HealthCheckModule {}
