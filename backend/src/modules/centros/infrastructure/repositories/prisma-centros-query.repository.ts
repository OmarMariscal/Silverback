import { traducirEstadoPoaADominio } from '@core/utils/estados-poa.traslator';
import { PrismaService } from '@database/prisma.service';
import { ICentrosQueryRepository } from '@modules/centros/application/ports/centros-query.repository.interface';
import { FiltrosPoaDeCentro } from '@modules/centros/application/ports/filtros/poa-de-centro.filter';
import { PoaDeCentroResult } from '@modules/centros/application/ports/results/poa-de-centro.result';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaCentrosQueryRepository implements ICentrosQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

      async obtenerPoaDeCentro(
    filtros: FiltrosPoaDeCentro,
  ): Promise<PoaDeCentroResult | null> {
    const { jefaUsuarioId, centroId, anioFiscal } = filtros;

    // El filtro por Jefa vive en el WHERE: un centro ajeno es indistinguible
    // de uno inexistente (no se filtra información entre jurisdicciones).
    const poa = await this.prisma.poa.findFirst({
      where: {
        centro_id: centroId,
        anio_fiscal: anioFiscal,
        centro: {
          contralores: { some: { jefa: { usuario_id: jefaUsuarioId } } },
        },
      },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        anio_fiscal: true,
        estado: true,
        mensaje_resolucion: true,
        centro: { select: { clave: true, nombre: true } },
        contralor: {
          select: { usuario: { select: { nombre_completo: true } } },
        },
        actividades: {
          select: {
            id: true,
            folio: true,
            titulo: true,
            fecha_inicio: true,
            fecha_termino: true,
            porcentaje_global: true,
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

    if (!poa) return null;

    return {
      id: poa.id,
      anioFiscal: poa.anio_fiscal,
      estado: traducirEstadoPoaADominio(poa.estado),
      mensajeResolucion: poa.mensaje_resolucion,
      centro: { clave: poa.centro.clave, nombre: poa.centro.nombre },
      contralor: { nombreCompleto: poa.contralor.usuario.nombre_completo },
      // El folio es texto ("5", "05", "10"): se ordena numéricamente en memoria.
      actividades: [...poa.actividades]
        .sort((a, b) =>
          a.folio.localeCompare(b.folio, undefined, { numeric: true }),
        )
        .map((act) => ({
          id: act.id,
          folio: act.folio,
          titulo: act.titulo,
          fechaInicio: act.fecha_inicio,
          fechaTermino: act.fecha_termino,
          porcentajeGlobal: act.porcentaje_global ?? 0,
          auditoresNombres: act.auditores
            .map((a) => a.auditor.usuario.nombre_completo)
            .sort((a, b) => a.localeCompare(b)),
        })),
    };
  }
}