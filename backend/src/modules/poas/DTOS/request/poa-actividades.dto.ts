import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class EquipoAuditorDto{
    @ApiProperty({
            description: "Numero de participantes en la actividad",
            type: Number,
            example: 2
        })
    total_participantes: number;
    
    @ApiProperty({
            description: "Lista con los IDs de los auditores que participaran en la actividad",
            type: [String],
            example: ["uuid-auditor-1", "uuid-auditor-2"]
        })
    auditores_ids: string[];
}

export class CrearActividadesDto{
    @ApiPropertyOptional({
            description: "ID de la actividad dentro del banco de actividades",
            type: String,
            example: "banco-uuid-1"
        })
    banco_actividad_id?: string;

    @ApiProperty({
            description: "Titulo de la actividad",
            type: String,
            example: "Revisión al rubro de Obra Pública"
        })
    titulo: string;

    @ApiProperty({
            description: "Justificacion del porque de la Actividad",
            type: String,
            example: "Verificar el adecuado cumplimiento en mi Centro Universitario..."
        })
    justificacion: string;

    @ApiProperty({
            description: "Objetivo de la actividad",
            type: String,
            example: 2026
        })
    objetivo_general: string;

    @ApiProperty({
            description: "Informacion sobre el equipo de participantes en esta actividad",
            type: EquipoAuditorDto,
        })
    equipo_auditor: EquipoAuditorDto;
}