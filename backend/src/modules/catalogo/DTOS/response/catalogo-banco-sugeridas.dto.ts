import { ApiProperty } from "@nestjs/swagger";

class ActividadSugeridaDto{
    @ApiProperty({
        description: 'ID de la actividad sugerida',
        type: String,
        example: "actividad-uuid-1"
    })
    id: string;

    @ApiProperty({
        description: 'Descripcion de la actividad sugerida',
        type: String,
        example: "Elaborar acta circunstanciada para desincorporar del Patrimonio..."
    })
    descripcion: string;

    @ApiProperty({
        description: 'Que tipo de actividad es la sugerida',
        type: String,
        example: "AUDITORIA"
    })
    tipo_sugerido: string;
}

export class ActividadSugeridaDataDto{
    @ApiProperty({
        description: 'Lista de actividades sugeridas',
        type: [ActividadSugeridaDto],
    })
    data: ActividadSugeridaDto[];
}