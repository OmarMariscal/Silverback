import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service'; // Ajusta a tu ruta de Prisma
import type { 
  IDashboardQueryRepository, 
  GetKpisDashboardQuery 
} from '../../application/ports/dashboard-query.repository.interface';

// 1. Importamos la interfaz exacta que creó tu compañero
import { KpiSubActividadPayLoad } from '@domain/kpi/interfaces/kpi-actividad-payload.interface';

@Injectable()
export class PrismaDashboardQueryRepository implements IDashboardQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ========================================================================
  // 💡 EL MÉTODO PRIVADO DEL SELECT (EL "MOLDE" EXACTO)
  // ========================================================================
  /**
   * 🚀 EL PARCHE CLAVE:
   * Aquí ajustamos el "include/select" de Prisma para que viaje por las relaciones 
   * hasta llegar a la tabla del Centro Universitario.
   * Traemos exactamente los 3 datos que pide la interfaz (id, clave, nombre)[cite: 7].
   * Esto previene saturar la memoria RAM porque no traemos columnas inútiles.
   */
  private get selectKpiPayload() {
    return {
      id: true,
      fecha_termino: true, // Vital para calcular el semáforo
      estado_operativo: true, // Vital para calcular los flujos
      
      // Viajamos por las relaciones de Prisma: SubActividad -> Actividad -> POA -> Centro
      actividad: {
        select: {
          poa: {
            select: {
              centro: { // <-- Hacemos el Join explícito a la tabla 'centro'
                select: {
                  id: true,
                  clave: true,
                  nombre: true,
                }
              }
            }
          }
        }
      }
    };
  }

  // ========================================================================
  // 💡 MÉTODOS PÚBLICOS (EL "QUIÉN Y DÓNDE" VAMOS A BUSCAR)
  // ========================================================================
  
  /**
   * DASHBOARD DEL CONTRALOR
   * Filtra las actividades para que solo vea las de su POA en el año actual.
   */
  public async obtenerKpisContralor(query: GetKpisDashboardQuery) {
    const { usuarioActualId } = query;
    const anioActual = new Date().getFullYear();

    // 1. Ejecutamos la consulta con el filtro específico del contralor
    const subactividadesRaw = await this.prisma.subActividad.findMany({
      where: {
        actividad: {
          poa: {
            contralor: {usuario_id: usuarioActualId},
            anio_fiscal: anioActual,       
          }
        }
      },
      select: this.selectKpiPayload // Usamos nuestro molde optimizado
    });

    // 2. Mapeamos la respuesta cruda de Prisma a la interfaz de tu compañero
    const payloads: KpiSubActividadPayLoad[] = subactividadesRaw.map(sub => ({
      id: sub.id,
      estado: sub.estado_operativo as any, // Casteo al Enum 'EstadosActividades'
      fechaTermino: sub.fecha_termino,
      
      // Construimos el objeto del Centro Universitario SI existe[cite: 7]
      centroUniversitario: sub.actividad?.poa?.centro ? {
        id: sub.actividad.poa.centro.id,
        clave: sub.actividad.poa.centro.clave,
        nombre: sub.actividad.poa.centro.nombre,
      } : undefined
    }));

    // 3. Retornamos el payload envuelto para que el Service lo orqueste
    return { payloads };
  }

  /**
   * DASHBOARD DE LA JEFATURA
   * Consulta global de todas las actividades del año en curso.
   */
  public async obtenerKpisJefa(query: GetKpisDashboardQuery) {
    const anioActual = new Date().getFullYear();

    // 1. Consulta global (Sin filtrar por contralor)
    const subactividadesRaw = await this.prisma.subActividad.findMany({
      where: {
        actividad: {
          poa: {
            anio_fiscal: anioActual, 
          }
        }
      },
      select: this.selectKpiPayload
    });

    // 2. Mismo mapeo exacto
    const payloads: KpiSubActividadPayLoad[] = subactividadesRaw.map(sub => ({
      id: sub.id,
      estado: sub.estado_operativo as any, 
      fechaTermino: sub.fecha_termino,
      centroUniversitario: sub.actividad?.poa?.centro ? {
        id: sub.actividad.poa.centro.id,
        clave: sub.actividad.poa.centro.clave,
        nombre: sub.actividad.poa.centro.nombre,
      } : undefined
    }));

    return { payloads };
  }

  /**
   * DASHBOARD DE REZAGO (VISTA GLOBAL)
   * Agrupa los atrasos, por lo que es vital traer el nombre y clave del centro.
   */
  public async obtenerCentrosConRezago() {
    // 1. Consulta para todas las actividades que NO estén concluidas
    const subactividadesRaw = await this.prisma.subActividad.findMany({
      where: {
        estado_operativo: {
          not: 'CONCLUIDA' 
        }
      },
      select: this.selectKpiPayload
    });

    // 2. Mapeo (Aquí es donde la calculadora de tu compañero usará el centroUniversitario para agrupar)
    const payloads: KpiSubActividadPayLoad[] = subactividadesRaw.map(sub => ({
      id: sub.id,
      estado: sub.estado_operativo as any,
      fechaTermino: sub.fecha_termino,
      centroUniversitario: sub.actividad?.poa?.centro ? {
        id: sub.actividad.poa.centro.id,
        clave: sub.actividad.poa.centro.clave,
        nombre: sub.actividad.poa.centro.nombre,
      } : undefined
    }));

    return { payloads };
  }
}