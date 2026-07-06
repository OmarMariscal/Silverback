import { ApiProperty } from "@nestjs/swagger";

class AuditoresDto{

    @ApiProperty({
        description: 'Identificador unico del auditor',
        type: String,
        example: 'uuid-auditor-1'
    })
    id: string;

    @ApiProperty({
        description: 'Nombre completo del auditor',
        type: String,
        example: 'Braulio Vicente Ruiz'
    })
    nombre_completo: string;

    @ApiProperty({
        description: 'Cargo del auditor',
        type: String,
        example: 'Mtro. Titular'
    })
    cargo_etiqueta: string;

}

export class AuditoresDataDto {
    @ApiProperty({
        description: 'Lista de auditores',
        type: [AuditoresDto]
    })
    data: AuditoresDto[];
}