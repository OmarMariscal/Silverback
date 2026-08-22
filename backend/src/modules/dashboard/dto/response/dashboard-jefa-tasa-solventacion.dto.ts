import { ApiProperty } from "@nestjs/swagger";

export class TasaSolventacionDto{
    @ApiProperty({
        description: 'Porcentaje de actividades solventadas',
        type: Number,
        example: 68
    })
    porcentaje: number;

    @ApiProperty({
        description: 'Tendencia mensual de solventacion',
        type: String,
        example: "+5%"
    })
    tendencia_mes: string;
}