import { Injectable, Inject } from '@nestjs/common';
import * as auditoresQueryRepositoryInterface from './ports/auditores-query.repository.interface';
import { AuditoresDataDto } from '../dto/response/auditores-data.dto'; // Ajusta tu ruta

@Injectable()
export class AuditoresService {
  constructor(
    @Inject(auditoresQueryRepositoryInterface.AUDITORES_QUERY_REPOSITORY_TOKEN)
    private readonly auditoresQueryRepo: auditoresQueryRepositoryInterface.IAuditoresQueryRepository,
  ) {}

  public async getAuditores(): Promise<AuditoresDataDto> {
    const result = await this.auditoresQueryRepo.obtenerAuditores();
    return result as AuditoresDataDto;
  }
}