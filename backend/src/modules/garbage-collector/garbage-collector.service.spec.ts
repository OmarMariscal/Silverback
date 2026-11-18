// [TASK-07] Pruebas unitarias para GarbageCollectorService
import { Test, TestingModule } from '@nestjs/testing';
import { GarbageCollectorService } from './garbage-collector.service';
import { PrismaService } from '@database/prisma.service';
import { STORAGE_PORT_TOKEN } from '@core/interfaces/storage/storage-port.interface';

describe('GarbageCollectorService', () => {
  let service: GarbageCollectorService;
  let mockPrisma: any;
  let mockStorage: any;

  beforeEach(async () => {
    mockPrisma = {
      evidencia: {
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    mockStorage = {
      eliminarObjetosEnLote: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GarbageCollectorService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: STORAGE_PORT_TOKEN, useValue: mockStorage },
      ],
    }).compile();

    service = module.get<GarbageCollectorService>(GarbageCollectorService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('no debe intentar borrar si no hay evidencias huérfanas', async () => {
    mockPrisma.evidencia.findMany.mockResolvedValue([]);

    await service.limpiarArchivosHuerfanos();

    expect(mockStorage.eliminarObjetosEnLote).not.toHaveBeenCalled();
    expect(mockPrisma.evidencia.deleteMany).not.toHaveBeenCalled();
  });

  it('debe ejecutar borrado físico en S3 y eliminación en Prisma cuando hay huérfanos', async () => {
    const huérfanos = [
      { id: 'uuid-1', s3_key: 'key-1' },
      { id: 'uuid-2', s3_key: 'key-2' },
    ];
    mockPrisma.evidencia.findMany.mockResolvedValue(huérfanos);
    mockStorage.eliminarObjetosEnLote.mockResolvedValue(undefined);
    mockPrisma.evidencia.deleteMany.mockResolvedValue({ count: 2 });

    await service.limpiarArchivosHuerfanos();

    expect(mockStorage.eliminarObjetosEnLote).toHaveBeenCalledWith(['key-1', 'key-2']);
    expect(mockPrisma.evidencia.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['uuid-1', 'uuid-2'] } },
    });
  });
});

