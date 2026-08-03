import { ApiProperty } from "@nestjs/swagger";

export class FlujoDto{
    @ApiProperty({
        description: "Número de actividades sin empezar",
        type: Number,
        example: 4
    })
    sin_empezar: number;

    @ApiProperty({
        description: "Número de actividades en proceso",
        type: Number,
        example: 12
    })
    en_proceso: number;

    @ApiProperty({
        description: "Número de actividades por revisar",
        type: Number,
        example: 2
    })
    por_revisar: number;

    @ApiProperty({
        description: "Número de actividades concluidas",
        type: Number,
        example: 6
    })
    concluidas: number;

    @ApiProperty({
        description: "Número de actividades totales",
        type: Number,
        example: 24
    })
    total: number;
}