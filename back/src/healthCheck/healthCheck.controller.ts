
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './healthCheck.service';
@Controller('health')
export class HealthCheckController {
    constructor(
        private readonly healthCheckService: HealthCheckService
    ) { }
    @Get()
    getHealth(): string {
        return this.healthCheckService.getHealth()
    }
}