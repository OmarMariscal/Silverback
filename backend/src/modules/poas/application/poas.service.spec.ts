import { Test, TestingModule } from '@nestjs/testing';
import { PoasService } from './poas.service';

describe('PoasService', () => {
  let service: PoasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoasService],
    }).compile();

    service = module.get<PoasService>(PoasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
