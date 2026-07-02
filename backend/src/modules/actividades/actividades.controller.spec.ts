import { Test, TestingModule } from '@nestjs/testing';
import { ActividadesController } from './actividades.controller';
import { ActividadesService } from './actividades.service';

describe('ActividadesController', () => {
  let controller: ActividadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActividadesController],
      providers: [ActividadesService],
    }).compile();

    controller = module.get<ActividadesController>(ActividadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
