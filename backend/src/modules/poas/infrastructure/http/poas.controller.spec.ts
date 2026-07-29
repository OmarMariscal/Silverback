import { Test, TestingModule } from '@nestjs/testing';
import { PoasController } from './poas.controller';
import { PoasService } from '@modules/poas/application/poas.service';

describe('PoasController', () => {
  let controller: PoasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoasController],
      providers: [PoasService],
    }).compile();

    controller = module.get<PoasController>(PoasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
