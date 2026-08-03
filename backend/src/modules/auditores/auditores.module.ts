import { Module } from '@nestjs/common';
import { AuditoresService } from './application/auditores.service';
import { AuditoresController } from './auditores.controller';

@Module({
  controllers: [AuditoresController],
  providers: [AuditoresService],
})
export class AuditoresModule {}
