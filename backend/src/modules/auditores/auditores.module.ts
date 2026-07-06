import { Module } from '@nestjs/common';
import { AuditoresService } from './auditores.service';
import { AuditoresController } from './auditores.controller';

@Module({
  controllers: [AuditoresController],
  providers: [AuditoresService],
})
export class AuditoresModule {}
