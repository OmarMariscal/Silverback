import { Test, TestingModule } from '@nestjs/testing';
import { AuditoresService } from './auditores.service';

describe('AuditoresService', () => {
  let service: AuditoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditoresService],
    }).compile();

    service = module.get<AuditoresService>(AuditoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
