import { Test, TestingModule } from '@nestjs/testing';
import { SubactividadesService } from './subactividades.service';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import { SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN } from './ports/subactividades-query.repository.interface';
import { SUBACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/subactividad.repository.interface';
import { UNIT_OF_WORK_TOKEN } from '@core/interfaces/unit-of-work.interface';
import { STORAGE_PORT_TOKEN } from '@core/interfaces/storage/storage-port.interface';

describe('SubactividadesService', () => {
  let service: SubactividadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubactividadesService,
        { provide: ACTIVIDAD_REPOSITORY_TOKEN, useValue: {} },
        { provide: SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN, useValue: {} },
        { provide: SUBACTIVIDAD_REPOSITORY_TOKEN, useValue: {} },
        { provide: UNIT_OF_WORK_TOKEN, useValue: {} },
        { provide: STORAGE_PORT_TOKEN, useValue: {} },
      ],
    }).compile();

    service = module.get<SubactividadesService>(SubactividadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
