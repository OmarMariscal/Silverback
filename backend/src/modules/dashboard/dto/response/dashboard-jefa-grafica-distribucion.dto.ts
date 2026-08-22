import { ApiProperty } from "@nestjs/swagger";

export class GraficaDistribucionDto{
    @ApiProperty({
        description: 'Numero de actividades sin empezar',
        type: Number,
        example: 28
    })
    sin_empezar: number;

    @ApiProperty({
        description: 'Numero de actividades en proceso',
        type: Number,
        example: 64
    })
    en_proceso: number;

    @ApiProperty({
        description: 'Numero de actividades por revisar',
        type: Number,
        example: 14
    })
    por_revisar: number;

    @ApiProperty({
        description: 'Numero de actividades concluidas',
        type: Number,
        example: 36
    })
    concluidas: number;

    @ApiProperty({
        description: 'Total de actividades',
        type: Number,
        example: 142
    })
    total_actividades_red: number;
}