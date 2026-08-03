import { ApiProperty } from "@nestjs/swagger";

export class GraficaSemaforoDto{
    @ApiProperty({
        description: 'Cantidad de tareas en estado de "a tiempo"',
        type: Number,
        example: 85
    })
    a_tiempo: number;

    @ApiProperty({
        description: 'Cantidad de tareas en estado de "alerta"',
        type: Number,
        example: 35
    })
    alerta: number;

    @ApiProperty({
        description: 'Cantidad de tareas en estado de "critico"',
        type: Number,
        example: 22
    })
    critico: number;

    @ApiProperty({
        description: 'Total de tareas',
        type: Number,
        example: 142
    })
    total_actividades_red: number;
}