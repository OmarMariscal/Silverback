import { Test, TestingModule } from '@nestjs/testing';
import { AuditoresController } from './auditores.controller';
import { AuditoresService } from './auditores.service';

describe('AuditoresController', () => {
  let controller: AuditoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoresController],
      providers: [AuditoresService],
    }).compile();

    controller = module.get<AuditoresController>(AuditoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
