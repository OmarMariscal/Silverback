import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service'; 
import { EstadoSubActividad, Prisma } from '@prisma/client'; // Importaciones vitales
import type { 
  IDashboardQueryRepository, 
  GetKpisDashboardQuery 
} from '../../application/ports/dashboard-query.repository.interface';
import { DashboardContralorResult } from '../../application/ports/results/dashboard-contralor.result';
import { DashboardJefaResult } from '../../application/ports/results/dashboard-jefa.result';
import { RezagoDataResult } from '../../application/ports/results/rezago-data.result';

@Injectable()
export class PrismaDashboardQueryRepository implements IDashboardQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // HELPER 1: Filtros de Seguridad RLS
  // ==========================================
  
  // Escudo para consultas que atacan a la tabla SubActividad
  private construirFiltroSeguridadSubActividad(usuarioUuid: string): Prisma.SubActividadWhereInput {
    return {
      actividad: {
        OR: [
          { auditores: { some: { auditor: { usuario_id: usuarioUuid } } } },
          { poa: { contralor: { usuario_id: usuarioUuid } } },
          { poa: { contralor: { jefa: { usuario_id: usuarioUuid } } } },
        ],
      },
    };
  }

  // Escudo para consultas que atacan directamente a la tabla POA
  private construirFiltroSeguridadPoa(usuarioUuid: string): Prisma.PoaWhereInput {
    return {
      OR: [
        { contralor: { usuario_id: usuarioUuid } },
        { contralor: { jefa: { usuario_id: usuarioUuid } } },
      ],
    };
  }

  // ==========================================
  // HELPER 2: Cálculo Retroactivo de Fechas
  // ==========================================
  private calcularFechaLimiteRetroactiva(diasHabilesRestar: number): Date {
    let diasRestados = 0;
    const fechaAux = new Date();
    while (diasRestados < diasHabilesRestar) {
      fechaAux.setDate(fechaAux.getDate() - 1);
      const diaSemana = fechaAux.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) diasRestados++;
    }
    return fechaAux;
  }

  // ==========================================
  // DASHBOARD CONTRALOR
  // ==========================================
  public async obtenerKpisContralor(query: GetKpisDashboardQuery): Promise<DashboardContralorResult> {
    const { usuarioActualId } = query; // Desestructuración del Query (estilo de tu compañero)
    
    const fecha60 = this.calcularFechaLimiteRetroactiva(60);
    const fecha90 = this.calcularFechaLimiteRetroactiva(90);
    const estadosActivos = [EstadoSubActividad.EN_PROGRESO, EstadoSubActividad.EN_REVISION, EstadoSubActividad.DEVUELTA];

    // Generamos los escudos de seguridad
    const filtroSubActividad = this.construirFiltroSeguridadSubActividad(usuarioActualId);
    const filtroPoa = this.construirFiltroSeguridadPoa(usuarioActualId);

    const [
      centro, 
      conteoDevueltas, 
      conteoBorrador, 
      subActividadesAgrupadas,
      semaforoATiempo,
      semaforoPrecaucion,
      semaforoCritico
    ] = await Promise.all([
      // 1. Centro Universitario (filtrado por su usuario de contralor)
      this.prisma.centroUniversitario.findFirst({
        where: { contralores: { some: { usuario_id: usuarioActualId } } },
        select: { clave: true, nombre: true },
      }),
      // 2. Bandeja de POAs (Protegida con filtroPoa)
      this.prisma.poa.count({ where: { AND: [filtroPoa, { estado: 'DEVUELTA' }] } }),
      this.prisma.poa.count({ where: { AND: [filtroPoa, { estado: 'BORRADOR' }] } }),
      
      // 3. Agrupación de flujo (Protegida con filtroSubActividad)
      this.prisma.subActividad.groupBy({
        by: ['estado_operativo'],
        where: filtroSubActividad,
        _count: { estado_operativo: true },
      }),

      // 4. Semáforos Matemáticos (Usando AND para fusionar Filtro + Lógica de negocio)
      this.prisma.subActividad.count({
        where: { 
          AND: [
            filtroSubActividad,
            { estado_operativo: { in: estadosActivos } },
            { fecha_inicio: { gt: fecha60 } }
          ]
        }
      }),
      this.prisma.subActividad.count({
        where: { 
          AND: [
            filtroSubActividad,
            { estado_operativo: { in: estadosActivos } },
            { fecha_inicio: { lte: fecha60, gt: fecha90 } }
          ]
        }
      }),
      this.prisma.subActividad.count({
        where: { 
          AND: [
            filtroSubActividad,
            { estado_operativo: { in: estadosActivos } },
            { fecha_inicio: { lte: fecha90 } }
          ]
        }
      })
    ]);

    // Procesamiento de datos (igual de rápido que antes)
    const flujo = { sin_empezar: 0, en_proceso: 0, por_revisar: 0, concluidas: 0, total: 0 };
    subActividadesAgrupadas.forEach((agrupacion) => {
      const cant = agrupacion._count.estado_operativo;
      if (agrupacion.estado_operativo === 'SIN_EMPEZAR') flujo.sin_empezar += cant;
      if (agrupacion.estado_operativo === 'EN_PROGRESO') flujo.en_proceso += cant;
      if (agrupacion.estado_operativo === 'EN_REVISION') flujo.por_revisar += cant;
      if (agrupacion.estado_operativo === 'CONCLUIDA') flujo.concluidas += cant;
      flujo.total += cant;
    });

    return {
      centro_universitario: {
        clave: centro?.clave || 'N/A',
        nombre: centro?.nombre || 'Centro no asignado',
      },
      tarjetas: {
        bandeja_entrada: { devueltas: conteoDevueltas, listas_empezar: conteoBorrador },
      },
      graficas: {
        flujo,
        semaforos: { 
          a_tiempo: semaforoATiempo, 
          alerta: semaforoPrecaucion, 
          critico: semaforoCritico, 
          total: semaforoATiempo + semaforoPrecaucion + semaforoCritico 
        }, 
      },
    };
  }

  // ==========================================
  // DASHBOARD JEFA 
  // ==========================================
  public async obtenerKpisJefa(query: GetKpisDashboardQuery): Promise<DashboardJefaResult> {
    const { usuarioActualId } = query; 
    const fecha60 = this.calcularFechaLimiteRetroactiva(60);
    const fecha90 = this.calcularFechaLimiteRetroactiva(90);
    const estadosActivos = [EstadoSubActividad.EN_PROGRESO, EstadoSubActividad.EN_REVISION, EstadoSubActividad.DEVUELTA];

    // ¡La magia del filtro universal! A la Jefa se le inyecta EXACTAMENTE el mismo filtro.
    // Como el `OR` de tu compañero incluye "jefa: { usuario_id: ... }", Prisma buscará 
    // todas las actividades de todos los centros que dependan de ella automáticamente.
    const filtroSubActividad = this.construirFiltroSeguridadSubActividad(usuarioActualId);

    const [subActividadesAgrupadas, semaforoATiempo, semaforoPrecaucion, semaforoCritico] = await Promise.all([
      this.prisma.subActividad.groupBy({ by: ['estado_operativo'], where: filtroSubActividad, _count: { estado_operativo: true } }),
      
      this.prisma.subActividad.count({ 
        where: { AND: [ filtroSubActividad, { estado_operativo: { in: estadosActivos } }, { fecha_inicio: { gt: fecha60 } } ] } 
      }),
      this.prisma.subActividad.count({ 
        where: { AND: [ filtroSubActividad, { estado_operativo: { in: estadosActivos } }, { fecha_inicio: { lte: fecha60, gt: fecha90 } } ] } 
      }),
      this.prisma.subActividad.count({ 
        where: { AND: [ filtroSubActividad, { estado_operativo: { in: estadosActivos } }, { fecha_inicio: { lte: fecha90 } } ] } 
      })
    ]);

    const flujo = { sin_empezar: 0, en_proceso: 0, por_revisar: 0, concluidas: 0, total_actividades_red: 0 };
    subActividadesAgrupadas.forEach((agrupacion) => {
      const cant = agrupacion._count.estado_operativo;
      if (agrupacion.estado_operativo === 'SIN_EMPEZAR') flujo.sin_empezar += cant;
      if (agrupacion.estado_operativo === 'EN_PROGRESO') flujo.en_proceso += cant;
      if (agrupacion.estado_operativo === 'EN_REVISION') flujo.por_revisar += cant;
      if (agrupacion.estado_operativo === 'CONCLUIDA') flujo.concluidas += cant;
      flujo.total_actividades_red += cant;
    });

    return {
      tarjetas_superiores: {
        pendientes: { actividades_por_revisar: flujo.por_revisar, actividades_solicitades: flujo.sin_empezar },
        precaucion: { total: semaforoPrecaucion, descripcion: 'Actividades en alerta amarilla' },
        riesgo_critico: { total: semaforoCritico, descripcion: 'Actividades vencidas o críticas' },
      },
      grafica_distribucion_estado: flujo,
      grafica_semaforos: { 
        a_tiempo: semaforoATiempo, 
        alerta: semaforoPrecaucion, 
        critico: semaforoCritico, 
        total_actividades_red: semaforoATiempo + semaforoPrecaucion + semaforoCritico 
      },
    };
  }

  // ==========================================
  // REZAGOS (Detalle por Centro)
  // ==========================================
  public async obtenerCentrosConRezago(): Promise<RezagoDataResult> {
    const fechaLimite60Dias = this.calcularFechaLimiteRetroactiva(60);
    const fechaLimite90Dias = this.calcularFechaLimiteRetroactiva(90);

    // Obtenemos los centros que tienen rezago, pero usamos "include" para traer sus subactividades rezagadas
    const centrosRezagados = await this.prisma.centroUniversitario.findMany({
      where: { poas: { some: { actividades: { some: { es_rezago: true } } } } },
      include: {
        poas: {
          select: {
            actividades: {
              where: { es_rezago: true },
              select: {
                sub_actividades: {
                  select: { fecha_inicio: true, estado_operativo: true }
                }
              }
            }
          }
        }
      }
    });

    // Mapeamos los datos y procesamos el cálculo de semáforo centro por centro
    const data = centrosRezagados.map((centro) => {
      let precaucion = 0;
      let criticas = 0;

      // Navegamos el objeto para extraer las subactividades y calcular sus colores
      centro.poas.forEach(poa => {
        poa.actividades.forEach(act => {
          act.sub_actividades.forEach(sub => {
            if (['EN_PROGRESO', 'EN_REVISION'].includes(sub.estado_operativo)) {
              if (sub.fecha_inicio <= fechaLimite90Dias) {
                criticas++;
              } else if (sub.fecha_inicio <= fechaLimite60Dias) {
                precaucion++;
              }
            }
          });
        });
      });

      return {
        centro_id: centro.id,
        centro_clave: centro.clave,
        centro_nombre: centro.nombre,
        distribucion: {
          actividades_criticas: criticas,
          actividades_precaucion: precaucion,
          total: criticas + precaucion
        }
      };
    });

    return { data };
  }
}

  