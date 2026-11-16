import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma.service';
import { ISubactividadRepository } from '@domain/actividad/subactividad.repository.interface';
import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { EvidenciaEntity } from '@domain/actividad/evidencia.entity';
import { EntregaSubActividadEntity } from '@domain/actividad/entrega-subactividad.entity';
import { EstadosArchivoEvidencia } from '@domain/actividad/estados-archivo-evidencia.enum';
import { TransactionHandle } from '@domain/shared/transaction.interface';
import { SubActividadMapper } from '../mappers/subactividad.mapper';
import { EvidenciaMapper } from '../mappers/evidencia.mapper';
import { EntregaSubActividadMapper } from '../mappers/entrega-subactividad.mapper';
import { SubActividadEjecucionInclude } from '../types/subactividad-ejecucion-include';
import {
  traducirEstadoArchivoAPrisma,
  traducirEstadoSubActividadAPrisma,
} from '@core/utils/estados-sub-actividades.traslator';

@Injectable()
export class PrismaSubActividadRepository implements ISubactividadRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subActividadMapper: SubActividadMapper,
    private readonly evidenciaMapper: EvidenciaMapper,
    private readonly entregaSubActividadMapper: EntregaSubActividadMapper,
  ) {}

  async obtenerPorIdConContexto(
    id: string,
    tx?: TransactionHandle,
  ): Promise<SubactividadEntity | null> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    const raw = await client.subActividad.findUnique({
      where: { id },
      include: SubActividadEjecucionInclude,
    });

    if (!raw) return null;

    return this.subActividadMapper.toDomain(raw);
  }

  async obtenerEvidenciaPorId(
    archivoId: string,
    tx?: TransactionHandle,
  ): Promise<EvidenciaEntity | null> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    const raw = await client.evidencia.findUnique({
      where: { id: archivoId },
    });

    if (!raw) return null;

    return this.evidenciaMapper.toDomain(raw);
  }

  async obtenerEvidenciasPorEstado(
    subActividadId: string,
    estado: EstadosArchivoEvidencia,
    tx?: TransactionHandle,
  ): Promise<EvidenciaEntity[]> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    const rawList = await client.evidencia.findMany({
      where: {
        sub_actividad_id: subActividadId,
        estado: traducirEstadoArchivoAPrisma(estado),
      },
      orderBy: { fecha_creacion: 'asc' },
    });

    return rawList.map((raw) => this.evidenciaMapper.toDomain(raw));
  }

  async guardarEvidencia(
    evidencia: EvidenciaEntity,
    tx?: TransactionHandle,
  ): Promise<void> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const data = this.evidenciaMapper.toPersistence(evidencia);

    await client.evidencia.upsert({
      where: { id: data.id },
      create: data,
      update: {
        estado: data.estado,
        entrega_id: data.entrega_id,
        nombre_original: data.nombre_original,
      },
    });
  }

  async eliminarEvidencia(
    archivoId: string,
    tx?: TransactionHandle,
  ): Promise<void> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    await client.evidencia.delete({
      where: { id: archivoId },
    });
  }

  async eliminarEvidenciasPorIds(
    archivosIds: string[],
    tx?: TransactionHandle,
  ): Promise<void> {
    if (archivosIds.length === 0) return;
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    await client.evidencia.deleteMany({
      where: { id: { in: archivosIds } },
    });
  }

  async registrarEntregaYActualizarSubActividad(
    subActividad: SubactividadEntity,
    entrega: EntregaSubActividadEntity,
    evidenciasConsolidadas: EvidenciaEntity[],
    tx?: TransactionHandle,
  ): Promise<void> {
    const dataEntrega = this.entregaSubActividadMapper.toPersistence(entrega);
    const idsEvidencias = evidenciasConsolidadas.map((ev) => ev.getId());

    const ejecutarOperacionesAtomicas = async (
      clientePrisma: Prisma.TransactionClient,
    ) => {
      // 1. Crear el registro inmutable de EntregaSubActividad
      await clientePrisma.entregaSubActividad.create({
        data: dataEntrega,
      });

      // 2. Consolidar las evidencias vinculándolas a la entrega y actualizando su estado a ENVIADO
      await clientePrisma.evidencia.updateMany({
        where: {
          id: { in: idsEvidencias },
          sub_actividad_id: subActividad.getId(),
        },
        data: {
          entrega_id: dataEntrega.id,
          estado: traducirEstadoArchivoAPrisma(EstadosArchivoEvidencia.ENVIADO),
        },
      });

      // 3. Actualizar el estado operativo y fecha_envio en SubActividad
      await clientePrisma.subActividad.update({
        where: { id: subActividad.getId() },
        data: {
          estado_operativo: traducirEstadoSubActividadAPrisma(
            subActividad.getEstado(),
          ),
          fecha_envio: subActividad.getFechaEnvio(),
        },
      });
    };

    // Motor de Ejecución Dual Mode (se une a UnitOfWork si viene tx, o abre transacción propia)
    if (tx) {
      await ejecutarOperacionesAtomicas(tx as Prisma.TransactionClient);
    } else {
      await this.prisma.$transaction(async (internalTx) => {
        await ejecutarOperacionesAtomicas(internalTx);
      });
    }
  }
}
