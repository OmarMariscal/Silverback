import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service'; 
import type { 
  IAuditoresQueryRepository, 
  GetAuditoresQuery 
} from '../../application/ports/auditores-query.repository.interface';
import { AuditoresDataResult } from '../../application/ports/results/auditores.result';

@Injectable()
export class PrismaAuditoresQueryRepository implements IAuditoresQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async obtenerAuditores(query: GetAuditoresQuery): Promise<AuditoresDataResult> {
    // 1. Desestructuramos el query (Aunque no filtremos por él, cumplimos el contrato)
    const { usuarioActualId } = query; 

    // 2. Consulta abierta (Sin RLS) porque es un catálogo de selección
    const auditores = await this.prisma.auditor.findMany({
      include: {
        usuario: true 
      }
    });

    // 3. Mapeo de la respuesta
    return {
      data: auditores.map((auditor) => ({
        id: auditor.id, 
        nombre_completo: auditor.usuario.nombre_completo,
        cargo_etiqueta: 'Auditor' 
      }))
    };
  }
}