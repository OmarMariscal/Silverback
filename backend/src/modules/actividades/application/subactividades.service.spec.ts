import { Test, TestingModule } from '@nestjs/testing';
import { SubactividadesService } from './subactividades.service';

describe('SubactividadesService', () => {
  let service: SubactividadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubactividadesService],
    }).compile();

    service = module.get<SubactividadesService>(SubactividadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
