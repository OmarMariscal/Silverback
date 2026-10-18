import { traducirEstadoPoaADominio } from '@core/utils/estados-poa.traslator';
import { PrismaService } from '@database/prisma.service';
import { FiltrosMiPoa } from '@modules/poas/application/ports/filtros/mi-poa.filter.interface';
import { IPoaQueryRepository } from '@modules/poas/application/ports/poa-query.repository.interface';
import { PoaActualResult } from '@modules/poas/application/ports/results/poa-actual.result';
import { Injectable } from '@nestjs/common';
import { FiltrosSupervisionCentros } from '@modules/poas/application/ports/filtros/supervision-centros.filter';
import { SupervisionCentroResult } from '@modules/poas/application/ports/results/supervision-centro.result';
import { FiltrosPoaDeCentro } from '@modules/poas/application/ports/filtros/poa-de-centro.filter';
import { PoaDeCentroResult } from '@modules/poas/application/ports/results/poa-de-centro.result';

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

    async obtenerSupervisionCentros(
    filtros: FiltrosSupervisionCentros,
  ): Promise<SupervisionCentroResult[]> {
    const { jefaUsuarioId, anioFiscal, historicLimit } = filtros;

    // 1. Centros bajo la jurisdicción de la Jefa, con sus contralores y
    //    el año/estado de todas sus POAs (ligero: sin actividades).
    const centros = await this.prisma.centroUniversitario.findMany({
      where: {
        contralores: { some: { jefa: { usuario_id: jefaUsuarioId } } },
      },
      orderBy: { clave: 'asc' },
      select: {
        id: true,
        clave: true,
        nombre: true,
        contralores: {
          orderBy: { id: 'asc' },
          select: {
            id: true,
            usuario: { select: { nombre_completo: true } },
          },
        },
        poas: {
          orderBy: [{ anio_fiscal: 'desc' }, { id: 'asc' }],
          select: {
            id: true,
            anio_fiscal: true,
            estado: true,
            contralor_id: true,
          },
        },
      },
    });

    

    // 2. POA vigente de cada centro (la del año fiscal pedido).
    const poaVigentePorCentro = new Map<
      string,
      (typeof centros)[number]['poas'][number]
    >();
    for (const centro of centros) {
      const vigente = centro.poas.find((p) => p.anio_fiscal === anioFiscal);
      if (vigente) poaVigentePorCentro.set(centro.id, vigente);
    }

    // 3. Avance de las actividades de las POAs vigentes: UNA sola consulta.
    const idsPoasVigentes = [...poaVigentePorCentro.values()].map((p) => p.id);
    const actividades =
      idsPoasVigentes.length === 0
        ? []
        : await this.prisma.actividad.findMany({
            where: { poa_id: { in: idsPoasVigentes } },
            select: { poa_id: true, porcentaje_global: true },
          });

    const avancePorPoa = new Map<string, number[]>();
    for (const act of actividades) {
      const lista = avancePorPoa.get(act.poa_id) ?? [];
      lista.push(act.porcentaje_global ?? 0);
      avancePorPoa.set(act.poa_id, lista);
    }

    // 4. Ensamblado del resultado
    return centros.map((centro) => {
      const poa = poaVigentePorCentro.get(centro.id);

      // Sin marca "activo" en BD, el contralor actual es el dueño de la POA
      // vigente o, si no hay POA, el único contralor que tenga el centro.
      const contralor =
        centro.contralores.find((c) => c.id === poa?.contralor_id) ??
        (centro.contralores.length === 1 ? centro.contralores[0] : undefined);

      return {
        id: centro.id,
        clave: centro.clave,
        nombre: centro.nombre,
        contralorActual: contralor
          ? { nombreCompleto: contralor.usuario.nombre_completo }
          : null,
        aniosHistoricos: [
          ...new Set(centro.poas.map((p) => p.anio_fiscal)),
        ].slice(0, historicLimit),
        poaAnioActual: poa
          ? {
              id: poa.id,
              anioFiscal: poa.anio_fiscal,
              estado: traducirEstadoPoaADominio(poa.estado),
              porcentajesActividades: avancePorPoa.get(poa.id) ?? [],
            }
          : null,
      };
    });
  }

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
