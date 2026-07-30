import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { ISubactividadesQueryRepository } from '@modules/actividades/application/ports/subactividaeds-query.repository.interface';
import { FiltroProximasAVencer } from '@modules/actividades/application/ports/filtros/proximas-a-vencer.filtro.interface';
import { SubActividadProximaVencerResult } from '@modules/actividades/application/ports/results/subactividad-proxima-a-vencer.result';
import { EstadoSubActividad, Prisma } from '@prisma/client';
import { PaginacionMetadata } from '@core/common/dto/response/paginacion-metadata';
import { PaginacionParams } from '@modules/actividades/application/ports/filtros/paginacion-params.filtro.interface';
import { FiltrosSupervision } from '@modules/actividades/application/ports/filtros/supervision.filtro.interface';
import { SubActividadSupervisionResult } from '@modules/actividades/application/ports/results/subactividad-supervision.result';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { FiltrosDirectorio } from '@modules/actividades/application/ports/filtros/directorio.filtro.interface';
import { SubActividadesDirectorioResult } from '@modules/actividades/application/ports/results/subactividades-directorio.result';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';
import { SubActividadPoaResult } from '@modules/actividades/application/ports/results/subactividad-para-poa.result';
import { FiltroObtenerPorActividadId } from '@modules/actividades/application/ports/filtros/obtener-por-actividad.filtro';
import { FiltroSeleccionadas } from '@modules/actividades/application/ports/filtros/seleccionadas.filtro';
import { SubActividadSelectResult } from '@modules/actividades/application/ports/results/subactividad-select.result';

@Injectable()
export class PrismaSubActividadQueryRepository implements ISubactividadesQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Endpoint: GET /api/v1/actividades/proximas-vencer
   */
  async obtenerProximasAVencer(
    filtros: FiltroProximasAVencer,
  ): Promise<SubActividadProximaVencerResult[]> {
    const rawList = await this.prisma.subActividad.findMany({
      where: {
        //1. Actividades que estén no concluidas
        estado_operativo: {
          notIn: [EstadoSubActividad.CONCLUIDA],
        },
        actividad: {
          OR: [
            {
              auditores: {
                some: { auditor: { usuario_id: filtros.usuarioUuid } },
              },
            },
            { poa: { contralor: { usuario_id: filtros.usuarioUuid } } },
            {
              poa: { contralor: { jefa: { usuario_id: filtros.usuarioUuid } } },
            },
          ],
        },
      },
      orderBy: {
        fecha_termino: 'asc',
      },

      take: filtros.limite,
      select: {
        id: true,
        descripcion_tarea: true,
        fecha_termino: true,
      },
    });

    return rawList.map((raw) => ({
      id: raw.id,
      titulo: raw.descripcion_tarea,
      fecha_vencimiento: raw.fecha_termino.toISOString().split('T')[0],
    }));
  }

  /**
   * Endpoint: GET /api/v1/actividades/supervision
   */
  async obtenerSupervision(
    filtros: FiltrosSupervision,
    paginacion: PaginacionParams,
  ): Promise<{
    meta: PaginacionMetadata;
    data: SubActividadSupervisionResult[];
  }> {
    // 1. Obtenermos los valores por defecto seguros
    const {
      pagina,
      limite,
      orden = 'desc',
      sortBy = 'fecha_envio',
    } = paginacion;
    const skip = (pagina - 1) * limite;

    // 2. Construcción del motor de filtros (Seguimientos y Rechazos)
    const wherePrisma = {
      // Como es supervisión, buscamos aquello que requiere atención
      estado_operativo: {
        in: [EstadoSubActividad.DEVUELTA],
      },

      //row-level Security (RLS) Emulado
      actividad: {
        OR: [
          {
            auditores: {
              some: { auditor: { usuario_id: filtros.usuarioUuid } },
            },
          },
          { poa: { contralor: { usuario_id: filtros.usuarioUuid } } },
          { poa: { contralor: { jefa: { usuario_id: filtros.usuarioUuid } } } },
        ],
      },
    };

    //3. Mapeo Seguro de Ordenamiento Dinámico
    // Evitamos inyección de dependencias validando las columnas permitidas
    const orderByPrisma: Prisma.SubActividadOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'titulo':
        orderByPrisma.descripcion_tarea = orden;
        break;
      case 'estado_resolucion':
        orderByPrisma.estado_operativo = orden;
        break;
      case 'fecha_vencimiento_poa':
        orderByPrisma.fecha_termino = orden;
        break;
      default:
        orderByPrisma.fecha_envio = orden;
        break;
    }

    // 3. Ejecución Transaccional Paralela (Máximo Rendimiento)
    // Dispara el Count y el Select al mismo tiempo en PostgreSQL
    const [totalItems, rawList] = await this.prisma.$transaction([
      this.prisma.subActividad.count({ where: wherePrisma }),
      this.prisma.subActividad.findMany({
        where: wherePrisma,
        skip,
        take: limite,
        orderBy: orderByPrisma,
        select: {
          id: true,
          descripcion_tarea: true,
          estado_operativo: true,
          fecha_envio: true,
          fecha_termino: true,
        },
      }),
    ]);

    // 5. Tranformación DTO
    const data: SubActividadSupervisionResult[] = rawList.map((raw) => ({
      id: raw.id,
      titulo: raw.descripcion_tarea,
      // Mapeo seguro de Prisma a Dominio
      estado_resolucion: raw.estado_operativo as unknown as EstadosActividades,
      fecha_envio: raw.fecha_envio!,
      fecha_vencimiento_poa: raw.fecha_termino,
    }));

    // 6. Construcción de Metadatos
    const totalPages = Math.ceil(totalItems / limite);

    return {
      meta: {
        total_registros: totalItems,
        pagina_actual: pagina,
        total_paginas: totalPages,
        limite: limite,
      },
      data,
    };
  }

  /**
   * Endpoint: GET /api/v1/actividades/supervision
   */
  async obtenerDirectorio(
    filtros: FiltrosDirectorio,
    paginacion: PaginacionParams,
  ): Promise<{
    meta: PaginacionMetadata;
    data: SubActividadesDirectorioResult[];
  }> {
    const {
      pagina,
      limite,
      orden = 'desc',
      sortBy = 'fecha_creacion',
    } = paginacion;
    const skip = (pagina - 1) * limite;

    // 1. MOTOR DE FILTROS DINÁMICOS
    const wherePrisma: Prisma.SubActividadWhereInput = {
      AND: [
        {
          actividad: {
            OR: [
              {
                auditores: {
                  some: { auditor: { usuario_id: filtros.usuarioUuid } },
                },
              },
              { poa: { contralor: { usuario_id: filtros.usuarioUuid } } },
              {
                poa: {
                  contralor: { jefa: { usuario_id: filtros.usuarioUuid } },
                },
              },
            ],
          },
        },
      ],
    };

    // A. Búsqueda por Texto (search)
    if (filtros.search && filtros.search.trim() !== '') {
      (wherePrisma.AND as Prisma.SubActividadWhereInput[]).push({
        OR: [
          {
            descripcion_tarea: {
              contains: filtros.search,
              mode: 'insensitive',
            },
          },
          { numero_orden: { contains: filtros.search, mode: 'insensitive' } },
          {
            actividad: {
              titulo: { contains: filtros.search, mode: 'insensitive' },
            },
          },
          {
            actividad: {
              folio: { contains: filtros.search, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    // B y C. Múltiples Estados Operativos (Consolidado para evitar duplicidad de push)
    if (filtros.estadoFlujo && filtros.estadoFlujo.length > 0) {
      const estadosPrisma = filtros.estadoFlujo.map(
        (estadoDominio) => estadoDominio as unknown as EstadoSubActividad,
      );

      (wherePrisma.AND as Prisma.SubActividadWhereInput[]).push({
        estado_operativo: { in: estadosPrisma },
      });
    }

    // D. Rango de Fechas
    if (filtros.fechaInicio || filtros.fechaFin) {
      const rangoFechas: Prisma.DateTimeFilter = {};
      if (filtros.fechaInicio) rangoFechas.gte = filtros.fechaInicio;
      if (filtros.fechaFin) rangoFechas.lte = filtros.fechaFin;

      (wherePrisma.AND as Prisma.SubActividadWhereInput[]).push({
        fecha_termino: rangoFechas,
      });
    }

    // E. Filtro por Centro Universitario
    if (filtros.centroUuid) {
      (wherePrisma.AND as Prisma.SubActividadWhereInput[]).push({
        actividad: { poa: { centro_id: filtros.centroUuid } },
      });
    }

    // 2. MAPEO SEGURO DE ORDENAMIENTO
    const orderByPrisma: Prisma.SubActividadOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'identificador':
        orderByPrisma.numero_orden = orden;
        break;
      case 'titulo':
        orderByPrisma.descripcion_tarea = orden;
        break;
      case 'fecha_termino':
        orderByPrisma.fecha_termino = orden;
        break;
      default:
        orderByPrisma.fecha_termino = orden;
        break;
    }

    // Definimos los selectores de forma explícita para que Prisma e inferencia trabajen perfecto
    const selectArgs = {
      id: true,
      numero_orden: true,
      tipo: true,
      descripcion_tarea: true,
      fecha_termino: true,
      estado_operativo: true,
      actividad: {
        select: {
          porcentaje_global: true,
          poa: {
            select: {
              centro: { select: { clave: true } },
              contralor: {
                select: { usuario: { select: { nombre_completo: true } } },
              },
            },
          },
          auditores: {
            select: {
              auditor: {
                select: { usuario: { select: { nombre_completo: true } } },
              },
            },
          },
        },
      },
    } as const;

    // 3. EJECUCIÓN PARALELA DE ALTO RENDIMIENTO
    // Forzamos el tipado correcto de la tupla devuelta mediante ascriptores
    const [totalItems, rawList] = (await this.prisma.$transaction([
      this.prisma.subActividad.count({ where: wherePrisma }),
      this.prisma.subActividad.findMany({
        where: wherePrisma,
        skip,
        take: limite,
        orderBy: orderByPrisma,
        select: selectArgs,
      }),
    ])) as [
      number,
      Array<Prisma.SubActividadGetPayload<{ select: typeof selectArgs }>>,
    ];

    // 4. MAPEO (FLATTENING) AL CONTRATO DEL FRONTEND
    const data: SubActividadesDirectorioResult[] = rawList.map((raw) => {
      const auditoresAsignados = raw.actividad?.auditores
        ?.map((a) => a.auditor?.usuario?.nombre_completo)
        ?.filter((nombre): nombre is string => typeof nombre === 'string');

      const auditorDeApoyo =
        auditoresAsignados && auditoresAsignados.length > 0
          ? auditoresAsignados
          : [];

      return {
        id: raw.id,
        identificador: raw.numero_orden,

        tipo: raw.tipo as unknown as TipoSubActividad,

        titulo: raw.descripcion_tarea,
        fecha_termino: raw.fecha_termino,

        centro_clave: raw.actividad?.poa?.centro?.clave ?? null,
        contralor:
          raw.actividad?.poa?.contralor?.usuario?.nombre_completo ?? null,
        participacion_porcentaje: raw.actividad?.porcentaje_global ?? null,

        auditor_apoyo: auditorDeApoyo,
        codigo_estado: raw.estado_operativo as unknown as EstadosActividades,
        cantidad_observaciones: 3, // Retorno ESTATICO. CAMBIAR EN LA ITERACIÓN 2
      };
    });

    // 5. CONSTRUCCIÓN DE METADATOS
    const totalPages = Math.ceil(totalItems / limite);

    return {
      meta: {
        total_registros: totalItems,
        pagina_actual: pagina,
        total_paginas: totalPages,
        limite: limite,
      },
      data,
    };
  }

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/sub-actividades-poa
   */
  async obtenerPorActividadIdParaPoa(
    filtro: FiltroObtenerPorActividadId,
  ): Promise<SubActividadPoaResult[]> {
    const rawList = await this.prisma.subActividad.findMany({
      where: {
        actividad: { id: filtro.actividadId },

        AND: [
          {
            actividad: {
              OR: [
                {
                  auditores: {
                    some: { auditor: { usuario_id: filtro.usuarioUuid } },
                  },
                },
                { poa: { contralor: { usuario_id: filtro.usuarioUuid } } },
                { poa: { contralor: { jefa_id: filtro.usuarioUuid } } },
              ],
            },
          },
        ],
      },
      orderBy: {
        numero_orden: 'asc',
      },

      select: {
        id: true,
        numero_orden: true,
        descripcion_tarea: true,
        tipo: true,
        fecha_inicio: true,
        fecha_termino: true,
      },
    });

    return rawList.map((sub) => ({
      id: sub.id,
      folio: sub.numero_orden,
      descripcion: sub.descripcion_tarea,
      tipo: sub.tipo as TipoSubActividad,
      fecha_inicio: sub.fecha_inicio,
      fecha_termino: sub.fecha_termino,
    }));
  }

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/sub-actividades-select
   */
  async obtenerPorActividadIdParaPoaSeleccionadas(
    filtro: FiltroSeleccionadas,
  ): Promise<SubActividadSelectResult[]> {
    // 1. Argumentos de Selección
    const selectArgs = Prisma.validator<Prisma.ActividadSelect>()({
      sub_actividades: {
        select: {
          id: true,
          numero_orden: true,
          descripcion_tarea: true,
          tipo: true,
          fecha_inicio: true,
          fecha_termino: true,
          banco_sub_actividad_id: true,
        },
        orderBy: { numero_orden: 'asc' },
      },
      banco_actividad: {
        select: {
          sub_actividades_sugeridas: {
            select: { id: true, descripcion: true, tipo_sugerido: true },
          },
        },
      },
    });

    // 2. Encontramos la Actividad Padre
    const actividadPadre = await this.prisma.actividad.findFirst({
      where: {
        id: filtro.actividadId,
        OR: [
          {
            auditores: {
              some: { auditor: { usuario_id: filtro.usuarioUuid } },
            },
          },
          { poa: { contralor: { usuario_id: filtro.usuarioUuid } } },
          { poa: { contralor: { jefa: { usuario_id: filtro.usuarioUuid } } } },
        ],
      },
      select: selectArgs,
    });

    // Fallo rápido si no existe o no hay permisos
    if (!actividadPadre) {
      return [];
    }

    // 3. PROCESAR LAS SELECCIONADAS
    const seleccionadas: SubActividadSelectResult[] =
      actividadPadre.sub_actividades.map((sub) => ({
        id: sub.id,
        folio: sub.numero_orden,
        descripcion: sub.descripcion_tarea,
        tipo: sub.tipo as string as TipoSubActividad,
        seleccionada: true,
        fecha_inicio: sub.fecha_inicio,
        fecha_termino: sub.fecha_termino,
      }));

    // 4. MOTOR DE DEDUPLICACIÓN
    const idsDeBancoYaSeleccionados = new Set(
      actividadPadre.sub_actividades
        .map((sub) => sub.banco_sub_actividad_id)
        .filter((id): id is string => typeof id === 'string'),
    );

    // 5. PROCESAR LAS SUGERIDAS (Catálogo)
    const sugeridasList =
      actividadPadre.banco_actividad?.sub_actividades_sugeridas || [];

    const sugeridas: SubActividadSelectResult[] = sugeridasList
      .filter((sugerencia) => !idsDeBancoYaSeleccionados.has(sugerencia.id))
      .map((sugerencia) => ({
        id: sugerencia.id,
        folio: '-',
        descripcion: sugerencia.descripcion,
        tipo: sugerencia.tipo_sugerido as string as TipoSubActividad,
        seleccionada: false,
      }));

    // 6. MERGE FINAL
    return [...seleccionadas, ...sugeridas];
  }
}
