import { PrismaService } from '@database/prisma.service';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { TransactionHandle } from '@domain/shared/transaction.interface';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ActividadMapper } from '../mappers/actividad.mapper';
import { SubActividadMapper } from '../mappers/subactividad.mapper';
import { ActividadFullInclude } from '../types/actividad-full-include';
import { PrismaActividadPayload } from '../types/actividad-payload.type';

@Injectable()
export class PrismaActividadRepository implements IActividadRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actividadMapper: ActividadMapper,
    private readonly subActividadMapper: SubActividadMapper,
  ) {}

  async obtenerPorId(
    id: string,
    tx?: TransactionHandle,
  ): Promise<ActividadEntity | null> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    const raw = await client.actividad.findUnique({
      where: { id },
      include: ActividadFullInclude,
    });

    if (!raw) return null;

    return this.actividadMapper.toDomain(raw);
  }

  async obtenerPorPoaId(
    id: string,
    tx?: TransactionHandle,
  ): Promise<ActividadEntity[]> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    const rawList = await client.actividad.findMany({
      where: { poa_id: id },
      include: { sub_actividades: true, auditores: true },
    });

    return rawList.map((raw) =>
      this.actividadMapper.toDomain(raw as PrismaActividadPayload),
    );
  }

  async guardar(
    actividad: ActividadEntity,
    poaId?: string,
    tx?: TransactionHandle,
  ): Promise<void> {
    const actividadid = actividad.getId();
    const dataPadre = this.actividadMapper.toPersistence(actividad);

    // Extraemos las colecciones en memoria
    const subActividades = actividad.getSubActividades();
    const subActividadesIds = subActividades.map((sub) => sub.getId());
    const auditoresIds = actividad.getAuditoresIds();

    /**
     * 1. Definimos el bloque de operaciones
     * Extraemos la lógica a una función interna que recibe un cliente Prisma.
     */
    const ejecutarOperacionesAtomicas = async (
      clientePrisma: Prisma.TransactionClient,
    ) => {
      // A. Actualizar el agregado raíz (actividad)
      if (poaId) {
        // MODO CREACIÓN: Viene desde PoasService.
        // Tenemos el poaId, así que usamos upsert de forma segura.
        await clientePrisma.actividad.upsert({
          where: { id: actividadid },
          create: {
            ...dataPadre,
            poa_id: poaId,
          },
          update: dataPadre,
        });
      } else {
        // MODO ACTUALIZACIÓN: Viene desde ActividadesService (ej. subactividades).
        // La actividad YA EXISTE y no necesitamos el poaId para actualizarla.
        await clientePrisma.actividad.update({
          where: { id: actividadid },
          data: dataPadre,
        });
      }

      // B. Sincronizar subactividades (Relación 1:N)
      await clientePrisma.subActividad.deleteMany({
        where: {
          actividad_id: actividadid,
          id: { notIn: subActividadesIds },
        },
      });

      for (const sub of subActividades) {
        const subData = this.subActividadMapper.toPersistence(sub);
        await clientePrisma.subActividad.upsert({
          where: { id: sub.getId() },
          create: { ...subData, actividad_id: actividadid },
          update: subData,
        });
      }

      // C. Sincronizar auditores (Tabla puente N:M)
      await clientePrisma.actividadAuditor.deleteMany({
        where: {
          actividad_id: actividadid,
          auditor_id: { notIn: auditoresIds },
        },
      });

      for (const auditorId of auditoresIds) {
        await clientePrisma.actividadAuditor.upsert({
          where: {
            actividad_id_auditor_id: {
              actividad_id: actividadid,
              auditor_id: auditorId,
            },
          },
          create: { actividad_id: actividadid, auditor_id: auditorId },
          update: {},
        });
      }
    };

    /**
     * 2. Motor de Ejecución (Dual Mode)
     */
    if (tx) {
      // MODO A: Viene de un Unit Of Work global (Ej. PoasService)
      // Usamos el 'tx' inyectado para unirnos a la transacción masiva sin abrir una nueva.
      await ejecutarOperacionesAtomicas(tx as Prisma.TransactionClient);
    } else {
      // MODO B: Ejecución Individual (Ej. ActividadesService)
      // Como no hay Unit Of Work global, Prisma abre su propia transacción atómica interna
      // para proteger la integridad de este Agregado Raíz.
      await this.prisma.$transaction(async (internalTx) => {
        await ejecutarOperacionesAtomicas(internalTx);
      });
    }
  }

  async eliminar(id: string, tx?: TransactionHandle): Promise<void> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    // Gracias al 'onDelete: Cascade'' borrar al padre destruye automáticamente a las hijas y las tablas puente
    await client.actividad.delete({
      where: { id },
    });
  }
}
