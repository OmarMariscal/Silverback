import { PrismaService } from '@database/prisma.service';
import { IActividadesQueryRepository } from '@modules/actividades/application/ports/actividades-query.repository.interface';
import { FiltroActividadFichaTecnica } from '@modules/actividades/application/ports/filtros/actividad-ficha-tecnica.filtro';
import { FiltroActividadResumen } from '@modules/actividades/application/ports/filtros/actividad-resumen.filtro';
import { ActividadFichaTecnicaResult } from '@modules/actividades/application/ports/results/actividad-ficha-tecnica.result';
import { ActividadResumenResult } from '@modules/actividades/application/ports/results/actividad-resumen.result';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaActividadQueryRepository implements IActividadesQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private construirFiltroAcceso(
    usuarioUuid: string,
  ): Prisma.ActividadWhereInput {
    return {
      OR: [
        { auditores: { some: { auditor: { usuario_id: usuarioUuid } } } },
        { poa: { contralor: { usuario_id: usuarioUuid } } },
        { poa: { contralor: { jefa: { usuario_id: usuarioUuid } } } },
      ],
    };
  }

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/resumen
   */
  async obtenerResumenPorId(
    filtro: FiltroActividadResumen,
  ): Promise<ActividadResumenResult | null> {
    const raw = await this.prisma.actividad.findFirst({
      where: {
        AND: [
          { id: filtro.actividadId },
          this.construirFiltroAcceso(filtro.usuarioUuid),
        ],
      },
      select: {
        id: true,
        titulo: true,
        justificacion: true,
        objetivo_general: true,
        objetivos_part: true,
        meta_proyecto: true,
        indicadores: true,
      },
    });

    if (!raw) return null;

    return {
      id: raw.id,
      titulo: raw.titulo,
      justificacion: raw.justificacion ?? undefined,
      objetivo_general: raw.objetivo_general ?? undefined,
      objetivos_particulares: raw.objetivos_part ?? undefined,
      meta_del_proyecto: raw.meta_proyecto ?? undefined,
      indicadores: raw.indicadores ?? undefined,
    };
  }

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/ficha-tecnica
   */
  async obtenerPorIdFichaTecnica(
    filtro: FiltroActividadFichaTecnica,
  ): Promise<ActividadFichaTecnicaResult | null> {
    const raw = await this.prisma.actividad.findFirst({
      where: {
        AND: [
          { id: filtro.actividadId },
          this.construirFiltroAcceso(filtro.usuarioUuid),
        ],
      },
      select: {
        id: true,
        titulo: true,
        justificacion: true,
        objetivo_general: true,
        objetivos_part: true,
        meta_proyecto: true,
        indicadores: true,
        auditores: {
          select: {
            auditor: {
              select: {
                usuario: { select: { id: true, nombre_completo: true } },
              },
            },
          },
        },
      },
    });

    if (!raw) return null;

    return {
      id: raw.id,
      titulo: raw.titulo,
      justificacion: raw.justificacion ?? '',
      objetivoGeneral: raw.objetivo_general ?? '',
      objetivosParticulares: raw.objetivos_part ?? '',
      metaDelProyecto: raw.meta_proyecto ?? '',
      indicadores: raw.indicadores ?? '',

      equipoAuditor: raw.auditores.map(({ auditor }) => ({
        id: auditor.usuario.id,
        nombre: auditor.usuario.nombre_completo,
      })),
    };
  }
}
