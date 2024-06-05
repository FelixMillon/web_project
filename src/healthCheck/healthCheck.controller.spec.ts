import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './healthCheck.controller';
import { HealthCheckService } from './healthCheck.service';

describe('AppController', () => {
  let healthCheckController: HealthCheckController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [HealthCheckService],
    }).compile();
    healthCheckService = app.get(HealthCheckService);
    healthCheckController = app.get<HealthCheckController>(HealthCheckController);
    await app.init();
  });

  describe('createUser', () => {
    it('should return OK', () => {
      const result = healthCheckService.getHealth();
        expect(result).toBe("OK");
    });
  });
});
