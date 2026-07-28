import { Injectable } from '@nestjs/common';
import { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { ActividadMapper } from '../mappers/actividad.mapper';
import { PrismaService } from '@database/prisma.service';
import { SubActividadMapper } from '../mappers/subactividad.mapper';

@Injectable()
export class PrismaActividadRepository implements IActividadRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actividadMapper: ActividadMapper,
    private readonly subActividadMapper: SubActividadMapper,
  ) {}

  async obtenerPorId(id: string): Promise<ActividadEntity | null> {
    const raw = await this.prisma.actividad.findUnique({
      where: { id },
      include: { sub_actividades: true, auditores: true },
    });

    if (!raw) {
      return null;
    }

    return this.actividadMapper.toDomain(raw);
  }

  async obtenerPorPoaId(id: string): Promise<ActividadEntity[]> {
    const rawList = await this.prisma.actividad.findMany({
      where: { poa_id: id },
      include: { sub_actividades: true, auditores: true },
    });

    return rawList.map((raw) => this.actividadMapper.toDomain(raw));
  }

  async guardar(actividad: ActividadEntity): Promise<void> {
    const actividadid = actividad.getId();
    const dataPadre = this.actividadMapper.toPersistence(actividad);

    // Extraemos las colecciaones en memoria
    const subActividades = actividad.getSubActividades();
    const subActividadesIds = subActividades.map((sub) => sub.getId());
    const auditoresIds = actividad.getAuditoresIds();

    /**
     * TRANSACCIÓN ATÓMICA
     * Garantiza que si falla la actualización de una subactividad
     * se revierte absolutamente todo, manteniendo la base de datos pristina.
     */
    await this.prisma.$transaction(async (tx) => {
      //1. Actualizar el agregado raíz (actividad)
      await tx.actividad.update({
        where: { id: actividadid },
        data: dataPadre,
      });

      // 2. Sincronizar subactividades (Relación 1:N)
      // A. Eliminar las sub-actividades quye fueron removidas del dominio
      await tx.subActividad.deleteMany({
        where: {
          actividad_id: actividadid,
          id: { notIn: subActividadesIds },
        },
      });

      // B. Upsert (Crear / Actualizar) las sub-actividades existentes
      for (const sub of subActividades) {
        const subData = this.subActividadMapper.toPersistence(sub);
        await tx.subActividad.upsert({
          where: { id: sub.getId() },
          create: {
            ...subData,
            actividad_id: actividadid,
          },
          update: subData,
        });
      }

      // 3. Sincronizar auditores (Tabla puente N:M)
      // A. Eliminar los auditores que ya no están asignados
      await tx.actividadAuditor.deleteMany({
        where: {
          actividad_id: actividadid,
          auditor_id: { notIn: auditoresIds },
        },
      });

      //B. Conectar los auditores actuales
      for (const auditorId of auditoresIds) {
        await tx.actividadAuditor.upsert({
          where: {
            actividad_id_auditor_id: {
              actividad_id: actividadid,
              auditor_id: auditorId,
            },
          },
          create: {
            actividad_id: actividadid,
            auditor_id: auditorId,
          },
          update: {}, // Si la relación ya existe, no hacemos nada
        });
      }
    });
  }

  async eliminar(id: string): Promise<void> {
    // Gracias al 'onDelete: Cascade'' borrar al padre destruye automáticamente a las hijas y las tablas puente
    await this.prisma.actividad.delete({
      where: { id },
    });
  }
}
