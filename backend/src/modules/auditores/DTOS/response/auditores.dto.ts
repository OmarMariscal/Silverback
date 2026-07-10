import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuditoresDto{

    @IsString()
    @ApiProperty({
        description: 'Identificador unico del auditor',
        type: String,
        example: 'uuid-auditor-1'
    })
    id: string;

    @IsString()
    @ApiProperty({
        description: 'Nombre completo del auditor',
        type: String,
        example: 'Braulio Vicente Ruiz'
    })
    nombre_completo: string;

    @IsString()
    @ApiProperty({
        description: 'Cargo del auditor',
        type: String,
        example: 'Mtro. Titular'
    })
    cargo_etiqueta: string;

}

