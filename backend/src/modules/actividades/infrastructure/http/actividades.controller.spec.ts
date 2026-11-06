import { Test, TestingModule } from '@nestjs/testing';
import { ActividadesController } from './actividades.controller';
import { SubactividadesController } from './subactividades.controller';
import { ActividadesService } from '../../application/actividades.service';

describe('ActividadesController', () => {
  let controller: ActividadesController;
  let service: jest.Mocked<
    Pick<
      ActividadesService,
      | 'getActividades'
      | 'getResumen'
      | 'getFichaTecnica'
      | 'patchFichaTecnica'
      | 'deleteActividad'
    >
  >;

  beforeEach(async () => {
    service = {
      getActividades: jest.fn(),
      getResumen: jest.fn(),
      getFichaTecnica: jest.fn(),
      patchFichaTecnica: jest.fn(),
      deleteActividad: jest.fn(),
    } as unknown as jest.Mocked<
      Pick<
        ActividadesService,
        | 'getActividades'
        | 'getResumen'
        | 'getFichaTecnica'
        | 'patchFichaTecnica'
        | 'deleteActividad'
      >
    >;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActividadesController],
      providers: [{ provide: ActividadesService, useValue: service }],
    }).compile();

    controller = module.get<ActividadesController>(ActividadesController);
  });

  it('delegates the main activity listing flow to the application service', () => {
    const query = { page: 1 } as any;
    const expected = { data: [] };
    service.getActividades.mockReturnValue(expected as any);

    expect(controller.getActividades(query)).toBe(expected);
    expect(service.getActividades).toHaveBeenCalledWith(query);
  });
});

describe('SubactividadesController', () => {
  let controller: SubactividadesController;
  let service: jest.Mocked<
    Pick<
      ActividadesService,
      | 'getSubActividadesPoa'
      | 'getSubActividadesSelect'
      | 'postSubActividadesBulk'
      | 'putSubActividadesSync'
    >
  >;

  beforeEach(async () => {
    service = {
      getSubActividadesPoa: jest.fn(),
      getSubActividadesSelect: jest.fn(),
      postSubActividadesBulk: jest.fn(),
      putSubActividadesSync: jest.fn(),
    } as unknown as jest.Mocked<
      Pick<
        ActividadesService,
        | 'getSubActividadesPoa'
        | 'getSubActividadesSelect'
        | 'postSubActividadesBulk'
        | 'putSubActividadesSync'
      >
    >;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubactividadesController],
      providers: [{ provide: ActividadesService, useValue: service }],
    }).compile();

    controller = module.get<SubactividadesController>(SubactividadesController);
  });

  it('delegates subactivity queries to the application service', () => {
    const expected = { data: [] };
    service.getSubActividadesPoa.mockReturnValue(expected as any);

    expect(controller.getSubActividadePoas('activity-1')).toBe(expected);
    expect(service.getSubActividadesPoa).toHaveBeenCalledWith('activity-1');
  });
});
