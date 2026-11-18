// [TAREA REZAGADA] Pruebas unitarias para PoaQueryRepository.obtenerSupervisionCentros
import { Test, TestingModule } from '@nestjs/testing';
import { PoaQueryRepository } from './prisma-poa-query.repository';
import { PrismaService } from '@database/prisma.service';
import { EstadoPoa } from '@prisma/client';

describe('PoaQueryRepository - obtenerSupervisionCentros', () => {
  let repository: PoaQueryRepository;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      centroUniversitario: {
        findMany: jest.fn(),
      },
      actividad: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoaQueryRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<PoaQueryRepository>(PoaQueryRepository);
  });

  it('debe omitir POA en estado BORRADOR para el año actual (hacerla invisible para la JEFA)', async () => {
    const anioActual = 2026;
    mockPrisma.centroUniversitario.findMany.mockResolvedValue([
      {
        id: 'centro-1',
        clave: 'CUCEI',
        nombre: 'Centro Universitario de Ciencias Exactas e Ingenierías',
        contralores: [{ id: 'ctrl-1', usuario: { nombre_completo: 'Juan Contralor' } }],
        poas: [
          {
            id: 'poa-borrador-2026',
            anio_fiscal: anioActual,
            estado: EstadoPoa.BORRADOR,
            contralor_id: 'ctrl-1',
          },
        ],
      },
    ]);
    mockPrisma.actividad.findMany.mockResolvedValue([]);

    const resultado = await repository.obtenerSupervisionCentros({
      jefaUsuarioId: 'jefa-uuid-1',
      anioFiscal: anioActual,
      historicLimit: 5,
    });

    expect(resultado[0].poaAnioActual).toBeNull();
  });

  it('debe incluir la POA del año actual si está en estado DEVUELTA', async () => {
    const anioActual = 2026;
    mockPrisma.centroUniversitario.findMany.mockResolvedValue([
      {
        id: 'centro-1',
        clave: 'CUCEI',
        nombre: 'Centro Universitario de Ciencias Exactas e Ingenierías',
        contralores: [{ id: 'ctrl-1', usuario: { nombre_completo: 'Juan Contralor' } }],
        poas: [
          {
            id: 'poa-devuelta-2026',
            anio_fiscal: anioActual,
            estado: EstadoPoa.DEVUELTA,
            contralor_id: 'ctrl-1',
          },
        ],
      },
    ]);
    mockPrisma.actividad.findMany.mockResolvedValue([
      { poa_id: 'poa-devuelta-2026', porcentaje_global: 50 },
    ]);

    const resultado = await repository.obtenerSupervisionCentros({
      jefaUsuarioId: 'jefa-uuid-1',
      anioFiscal: anioActual,
      historicLimit: 5,
    });

    expect(resultado[0].poaAnioActual).toBeDefined();
    expect(resultado[0].poaAnioActual?.id).toBe('poa-devuelta-2026');
    expect(resultado[0].poaAnioActual?.estado).toBe('DEVUELTA');
  });
});

