import { PrismaService } from '@database/prisma.service';
import { PoaEntity } from '@domain/poa/poa.entity';
import { IPoaRepository } from '@domain/poa/poa.repository.interface';
import { PoaMapper } from '../mappers/poa.mapper';

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

  async guardar(poa: PoaEntity): Promise<void> {
    const dataPersistence = this.poaMapper.toPersistence(poa);

    //Solo actualiza los metadatos. Las actividades se guardan en su propio repositorio
    await this.prisma.poa.upsert({
      where: { id: poa.getId() },
      create: dataPersistence,
      update: dataPersistence,
    });
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.poa.delete({ where: { id } });
  }
}
