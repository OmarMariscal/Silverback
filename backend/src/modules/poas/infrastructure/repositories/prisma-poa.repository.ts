import { PrismaService } from '@database/prisma.service';
import { PoaEntity } from '@domain/poa/poa.entity';
import { IPoaRepository } from '@domain/poa/poa.repository.interface';
import { PoaMapper } from '../mappers/poa.mapper';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TransactionHandle } from '@domain/shared/transaction.interface';

@Injectable()
export class PrismaPoaRepository implements IPoaRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly poaMapper: PoaMapper,
  ) {}

  async obtenerPorId(id: string): Promise<PoaEntity | null> {
    const raw = await this.prisma.poa.findUnique({ where: { id } });

    if (!raw) {
      return null;
    }

    return this.poaMapper.toDomain(raw);
  }

  async guardar(poa: PoaEntity, tx?: TransactionHandle): Promise<void> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const data = this.poaMapper.toPersistence(poa);
    await client.poa.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.poa.delete({ where: { id } });
  }
}
