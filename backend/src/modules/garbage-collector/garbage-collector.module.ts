// [TASK-07] Módulo para Garbage Collector
import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma.module';
import { StorageModule } from '@storage/storage.module';
import { GarbageCollectorService } from './garbage-collector.service';

@Module({
  imports: [PrismaModule, StorageModule],
  providers: [GarbageCollectorService],
  exports: [GarbageCollectorService],
})
export class GarbageCollectorModule {}

