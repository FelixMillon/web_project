import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './healthCheck.controller';
import { HealthCheckService } from './healthCheck.service';
import { BullQueueService } from '../bull/bull-queue.service';

describe('HealthCheckController', () => {
  let healthCheckController: HealthCheckController;
  let healthCheckService: HealthCheckService;

  const mockBullQueueService = {
    addJob: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [
        HealthCheckService,
        { provide: BullQueueService, useValue: mockBullQueueService },
      ],
    }).compile();

    healthCheckService = app.get<HealthCheckService>(HealthCheckService);
    healthCheckController = app.get<HealthCheckController>(HealthCheckController);
  });

  describe('getHealth', () => {
    it('should return OK', () => {
      jest.spyOn(healthCheckService, 'getHealth').mockImplementation(() => 'OK');
      expect(healthCheckController.getHealth()).toBe('OK');
    });
  });
});
