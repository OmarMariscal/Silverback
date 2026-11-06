import { ApiProperty } from "@nestjs/swagger";
import { AuditoresDto } from "./auditores.dto";

export class AuditoresDataDto {
    @ApiProperty({
        description: 'Lista de auditores',
        type: [AuditoresDto]
    })
    data: AuditoresDto[];
}