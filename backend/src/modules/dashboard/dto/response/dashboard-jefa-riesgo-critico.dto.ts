import { ApiProperty } from "@nestjs/swagger";

export class RiesgoCriticoDto{
    @ApiProperty({
        description: 'Numero de actividades en riesgo critico',
        type: Number,
        example: 8
    })
    total: number;

    @ApiProperty({
        description: 'Descripcion del estado de las actividades que caen en esta categoria',
        type: String,
        example: "Vencidas o por vencer"
    })
    descripcion: string;
}