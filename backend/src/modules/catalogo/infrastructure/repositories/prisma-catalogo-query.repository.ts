import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service'; 
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum'; 
import type { 
  ICatalogoQueryRepository, 
  GetBancoActividadesQuery, 
  GetBancoActividadByIdQuery, 
  GetCentrosQuery 
} from '../../application/ports/catalogo-query.repository.interface';
import { BancoActividadesDataResult } from '../../application/ports/results/catalogo-banco.result';
import { BancoIdResult } from '../../application/ports/results/catalogo-banco-id.result';
import { ActividadSugeridaDataResult } from '../../application/ports/results/catalogo-banco-sugeridas.result';
import { CentroDataResult } from '../../application/ports/results/catalogo-centro.result';

@Injectable()
export class PrismaCatalogoQueryRepository implements ICatalogoQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async obtenerBancoActividades(query: GetBancoActividadesQuery): Promise<BancoActividadesDataResult> {
    const { busqueda } = query; 

    const actividades = await this.prisma.bancoActividad.findMany({
      where: busqueda ? {
        titulo: { contains: busqueda, mode: 'insensitive' }
      } : undefined
    });

    return {
      data: actividades.map((act) => ({
        id: act.id,
        // 1. Regresamos al valor por defecto que tenías originalmente
        tipo: TipoSubActividad.AUDITORIA, 
        titulo: act.titulo,
        // 2. Regresamos a tu lógica original de recortar el objetivo general
        descripcion_corta: act.objetivo_gen_plantilla 
          ? act.objetivo_gen_plantilla.substring(0, 80) + '...' 
          : 'Sin descripción'
      }))
    };
  }

  public async obtenerBancoActividadPorId(query: GetBancoActividadByIdQuery): Promise<BancoIdResult | null> {
    const { id } = query; 

    const actividad = await this.prisma.bancoActividad.findUnique({
      where: { id }
    });

    if (!actividad) return null;

    return {
      id: actividad.id,
      titulo: actividad.titulo,
      justificacion_plantilla: actividad.justificacion_plantilla || '',
      objetivo_gen_plantilla: actividad.objetivo_gen_plantilla || ''
    };
  }

  public async obtenerSubActividadesSugeridas(query: GetBancoActividadByIdQuery): Promise<ActividadSugeridaDataResult> {
    const { id } = query;

    const sugeridas = await this.prisma.bancoSubActividad.findMany({
      where: { banco_actividad_id: id }
    });

    return {
      data: sugeridas.map((sub) => ({
        id: sub.id,
        descripcion: sub.descripcion,
        // 3. Mantenemos el casteo a tu enum
        tipo_sugerido: sub.tipo_sugerido as unknown as TipoSubActividad 
      }))
    };
  }

  public async obtenerCentros(query: GetCentrosQuery): Promise<CentroDataResult> {
    const centros = await this.prisma.centroUniversitario.findMany();

    return {
      data: centros.map((centro) => ({
        id: centro.id,
        clave: centro.clave,
        nombre: centro.nombre,
        // 4. Regresamos el subtítulo estático que tenías antes
        subtitulo_interfaz: 'UdeG' 
      }))
    };
  }
}