import { traducirEstadoPoaADominio } from '@core/utils/estados-poa.traslator';
import { PrismaService } from '@database/prisma.service';
import { FiltrosMiPoa } from '@modules/poas/application/ports/filtros/mi-poa.filter.interface';
import { IPoaQueryRepository } from '@modules/poas/application/ports/poa-query.repository.interface';
import { PoaActualResult } from '@modules/poas/application/ports/results/poa-actual.result';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PoaQueryRepository implements IPoaQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerMiPoaActual(
    filtros: FiltrosMiPoa,
  ): Promise<PoaActualResult | null> {
    // 1. CONSULTA MAESTRA ÚNICA
    const poaData = await this.prisma.poa.findFirst({
      where: {
        contralor: { usuario_id: filtros.usuarioUuid },
        anio_fiscal: new Date().getFullYear(), //Obtener la POA del año actual
      },
      orderBy: { anio_fiscal: 'desc' },
      select: {
        id: true,
        estado: true,
        anio_fiscal: true,
        actividades: {
          select: {
            id: true,
            folio: true,
            titulo: true,
            porcentaje_global: true,
            es_rezago: true,
            fecha_inicio: true,
            fecha_termino: true,
            auditores: {
              select: {
                auditor: {
                  select: { usuario: { select: { nombre_completo: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!poaData) return null;

    // 2. CÁLCULO DE FECHAS EN MEMORIA
    let fechaInicioGlobal: Date | null = null;
    let fechaTerminoGlobal: Date | null = null;

    if (poaData.actividades.length > 0) {
      // Extraemos los timestamps válidos para buscar el menor y mayor
      const tiemposInicio = poaData.actividades
        .map((a) => a.fecha_inicio?.getTime())
        .filter((t): t is number => t !== undefined && t !== null);

      const tiemposTermino = poaData.actividades
        .map((a) => a.fecha_termino?.getTime())
        .filter((t): t is number => t !== undefined && t !== null);

      if (tiemposInicio.length > 0) {
        fechaInicioGlobal = new Date(Math.min(...tiemposInicio));
      }

      if (tiemposTermino.length > 0) {
        fechaTerminoGlobal = new Date(Math.max(...tiemposTermino));
      }
    }

    // 3. Construcción del retorno
    return {
      id: poaData.id,
      estado: traducirEstadoPoaADominio(poaData.estado),
      anioFiscal: poaData.anio_fiscal,
      fechaInicio: fechaInicioGlobal,
      fechaTermino: fechaTerminoGlobal,

      actividadesResumen: poaData.actividades.map((act) => ({
        id: act.id,
        folio: act.folio,
        titulo: act.titulo,
        porcentajeGlobal: act.porcentaje_global ?? null,
        esRezago: act.es_rezago,
        auditoresNombres: act.auditores.map(
          (aud) => aud.auditor.usuario.nombre_completo,
        ),
      })),
    };
  }
}
