import { Injectable, Inject } from '@nestjs/common';

// 1. Importaciones normales
import { 
  AUDITORES_QUERY_REPOSITORY_TOKEN, 
  GetAuditoresQuery 
} from './ports/auditores-query.repository.interface';

// 2. ¡La importación segura con TYPE para evitar el error ts(1272)!
import type { 
  IAuditoresQueryRepository 
} from './ports/auditores-query.repository.interface';

import { AuditoresDataDto } from '../dto/response/auditores-data.dto';

@Injectable()
export class AuditoresService {
  constructor(
    @Inject(AUDITORES_QUERY_REPOSITORY_TOKEN)
    private readonly auditoresQueryRepo: IAuditoresQueryRepository,
  ) {}

  public async getAuditores(query: GetAuditoresQuery): Promise<AuditoresDataDto> {
    // 3. Deconstrucción (por legibilidad)
    const { usuarioActualId } = query;

    // 4. Mandamos el objeto Query completito al repositorio
    const result = await this.auditoresQueryRepo.obtenerAuditores(query);
    
    return result as AuditoresDataDto;
  }
}