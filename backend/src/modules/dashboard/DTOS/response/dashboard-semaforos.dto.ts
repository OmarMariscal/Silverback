import { ApiProperty } from "@nestjs/swagger";

export class SemaforosDto{
    @ApiProperty({
        description: "Numero de actividades en verde",
        type: Number,
        example: 17
    })
    a_tiempo: number;

    @ApiProperty({
        description: "Número de actividades en amarillo",
        type: Number,
        example: 5
    })
    alerta: number;

    @ApiProperty({
        description: "Número de actividades en rojo",
        type: Number,
        example: 2
    })
    critico: number;

    @ApiProperty({
        description: "Número de actividades totales",
        type: Number,
        example: 14
    })
    total: number;
}