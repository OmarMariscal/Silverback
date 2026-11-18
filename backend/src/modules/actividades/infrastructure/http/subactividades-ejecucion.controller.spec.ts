// [TASK-04 y TASK-06] Pruebas unitarias para SubactividadesEjecucionController
import { Test, TestingModule } from '@nestjs/testing';
import { SubactividadesEjecucionController } from './subactividades-ejecucion.controller';
import { SubactividadesService } from '../../application/subactividades.service';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { Roles } from '@domain/roles/roles.enum';

describe('SubactividadesEjecucionController', () => {
  let controller: SubactividadesEjecucionController;
  let service: any;

  const mockUsuario: SesionUsuario = {
    usuario_id: 'user-uuid-1',
    perfil_id: 'perfil-uuid-1',
    rol: Roles.CONTRALOR,
    actor: { rol: Roles.CONTRALOR, permisos: [] } as any,
  };

  beforeEach(async () => {
    service = {
      generarPreFirmaEvidencia: jest.fn(),
      confirmarEvidenciaSubida: jest.fn(),
      eliminarEvidencia: jest.fn(),
      enviarSubActividadARevision: jest.fn(),
      getVistaEntrega: jest.fn(),
      getHistorial: jest.fn(),
      getVersionDetalle: jest.fn(),
      getLinkDescarga: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubactividadesEjecucionController],
      providers: [
        {
          provide: SubactividadesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<SubactividadesEjecucionController>(
      SubactividadesEjecucionController,
    );
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('GET :subActividadId/vista-entrega [TASK-04]', () => {
    it('debe llamar a subactividadesService.getVistaEntrega con los parámetros correctos', async () => {
      const mockResult = {
        meta_cabecera: {
          folio: '05.1',
          titulo: 'Verificación',
          centro_clave: 'CUCEI',
          version_actual: 3,
          etiqueta_semaforo: 'Próximo a Vencer',
          permite_entrega: true,
          permite_carga_evidencias: true,
        },
      };
      service.getVistaEntrega.mockResolvedValue(mockResult);

      const result = await controller.getVistaEntrega(
        mockUsuario,
        'subactividad-uuid-1',
      );

      expect(service.getVistaEntrega).toHaveBeenCalledWith({
        usuarioActual: mockUsuario,
        subActividadId: 'subactividad-uuid-1',
      });
      expect(result).toBe(mockResult);
    });
  });

  describe('GET :subActividadId/historial [TASK-06]', () => {
    it('debe llamar a subactividadesService.getHistorial', async () => {
      const mockHistorial = { data: [] };
      service.getHistorial.mockResolvedValue(mockHistorial);

      const result = await controller.getHistorial(
        mockUsuario,
        'subactividad-uuid-1',
      );

      expect(service.getHistorial).toHaveBeenCalledWith({
        usuarioActual: mockUsuario,
        subActividadId: 'subactividad-uuid-1',
      });
      expect(result).toBe(mockHistorial);
    });
  });

  describe('GET :subActividadId/versiones/:versionId [TASK-06]', () => {
    it('debe llamar a subactividadesService.getVersionDetalle', async () => {
      const mockDetalle = { folio: '05.1', version_visualizada: 2 };
      service.getVersionDetalle.mockResolvedValue(mockDetalle);

      const result = await controller.getVersionDetalle(
        mockUsuario,
        'subactividad-uuid-1',
        'version-uuid-1',
      );

      expect(service.getVersionDetalle).toHaveBeenCalledWith({
        usuarioActual: mockUsuario,
        subActividadId: 'subactividad-uuid-1',
        versionId: 'version-uuid-1',
      });
      expect(result).toBe(mockDetalle);
    });
  });

  describe('GET :subActividadId/versiones/:versionId/evidencias/:archivoId/link-descarga [TASK-06]', () => {
    it('debe llamar a subactividadesService.getLinkDescarga', async () => {
      const mockLink = { url_descarga_efimera: 'https://presigned.url' };
      service.getLinkDescarga.mockResolvedValue(mockLink);

      const result = await controller.getLinkDescarga(
        mockUsuario,
        'subactividad-uuid-1',
        'version-uuid-1',
        'archivo-uuid-1',
      );

      expect(service.getLinkDescarga).toHaveBeenCalledWith({
        usuarioActual: mockUsuario,
        subActividadId: 'subactividad-uuid-1',
        versionId: 'version-uuid-1',
        archivoId: 'archivo-uuid-1',
      });
      expect(result).toBe(mockLink);
    });
  });
});

