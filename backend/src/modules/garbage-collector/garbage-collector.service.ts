// [TASK-07] Garbage Collector (Cron Job) para Archivos Huérfanos
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@database/prisma.service';
import { EstadoArchivoEvidencia } from '@prisma/client';
import type { IStoragePort } from '@core/interfaces/storage/storage-port.interface';
import { STORAGE_PORT_TOKEN } from '@core/interfaces/storage/storage-port.interface';

@Injectable()
export class GarbageCollectorService {
  private readonly logger = new Logger(GarbageCollectorService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_PORT_TOKEN)
    private readonly storagePort: IStoragePort,
  ) {}

  /**
   * Cron Job programado para correr de madrugada (2:00 AM diario).
   * Detecta registros de evidencia en estado PENDIENTE con más de 24 horas,
   * ejecuta el borrado físico en S3 y la eliminación del registro en Prisma.
   */
  @Cron('0 2 * * *')
  async limpiarArchivosHuerfanos(): Promise<void> {
    this.logger.log('Iniciando recolección de archivos huérfanos (Garbage Collector)...');

    const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 1. Detectar registros de evidencia en estado PENDIENTE con más de 24 horas
    const huérfanos = await this.prisma.evidencia.findMany({
      where: {
        estado: EstadoArchivoEvidencia.PENDIENTE,
        fecha_creacion: {
          lt: hace24Horas,
        },
      },
      select: {
        id: true,
        s3_key: true,
      },
    });

    if (huérfanos.length === 0) {
      this.logger.log('No se encontraron archivos de evidencia huérfanos.');
      return;
    }

    this.logger.log(
      `Se encontraron ${huérfanos.length} archivos huérfanos para eliminar. Procediendo al borrado en S3 y base de datos...`,
    );

    // 2. Ejecutar borrado físico en S3
    const s3Keys = huérfanos.map((h) => h.s3_key);
    try {
      await this.storagePort.eliminarObjetosEnLote(s3Keys);
      this.logger.log(`Borrado físico completado para ${s3Keys.length} objetos en S3.`);
    } catch (error) {
      this.logger.error('Error durante la eliminación física en S3:', error);
    }

    // 3. Eliminación del registro en Prisma
    const ids = huérfanos.map((h) => h.id);
    const resultado = await this.prisma.evidencia.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    this.logger.log(
      `Garbage Collector finalizado: ${resultado.count} registros eliminados exitosamente de la base de datos.`,
    );
  }
}

