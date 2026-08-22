import { Module } from '@nestjs/common';
import { AuditoresController } from './infrastructure/http/auditores.controller'; // Ajusta rutas
import { AuditoresService } from './application/auditores.service';
import { PrismaAuditoresQueryRepository } from './infrastructure/repositories/prisma-auditores-query.repository';
import { AUDITORES_QUERY_REPOSITORY_TOKEN } from './application/ports/auditores-query.repository.interface';

@Module({
  controllers: [AuditoresController],
  providers: [
    AuditoresService,
    {
      provide: AUDITORES_QUERY_REPOSITORY_TOKEN,
      useClass: PrismaAuditoresQueryRepository,
    }
  ],
})
export class AuditoresModule {}