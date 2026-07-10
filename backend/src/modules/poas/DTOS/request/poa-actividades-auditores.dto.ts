import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber } from "class-validator";

export class EquipoAuditorDto{
    @IsNumber()
    @ApiProperty({
            description: "Numero de participantes en la actividad",
            type: Number,
            example: 2
        })
    total_participantes: number;
    
    @IsArray()
    @ApiProperty({
            description: "Lista con los IDs de los auditores que participaran en la actividad",
            type: [String],
            example: ["uuid-auditor-1", "uuid-auditor-2"]
        })
    auditores_ids: string[];
}