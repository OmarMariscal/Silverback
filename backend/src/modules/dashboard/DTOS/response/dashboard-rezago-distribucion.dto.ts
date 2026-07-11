import { ApiProperty } from "@nestjs/swagger";

export class DistribucionDto{
    @ApiProperty({
        description: 'Numero de actividades en semaforo rojo',
        type: Number,
        example: 8
    })
    actividades_criticas: number;

    @ApiProperty({
        description: 'Numero de actividades en semaforo amarillo',
        type: Number,
        example: 10
    })
    actividades_precaucion: number;

    @ApiProperty({
        description: 'Suma de actividades criticas y en precaucion',
        type: Number,
        example: 18
    })
    total: number;
}