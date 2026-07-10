import { ApiProperty } from "@nestjs/swagger";

export class PendientesDto{
    @ApiProperty({
        description: 'Numero de actividades por revisar',
        type: Number,
        example: 14
    })
    actividades_por_revisar: number;

    @ApiProperty({
        description: 'Numero de actividades solicitadas',
        type: Number,
        example: 5
    })
    actividades_solicitades: number;
}