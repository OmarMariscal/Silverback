import { ApiProperty } from "@nestjs/swagger";

export class PrecaucionDto{
    @ApiProperty({
        description: 'Numero de actividades en precaucion',
        type: Number,
        example: 23
    })
    total: number;

    @ApiProperty({
        description: 'Descripcion del estado de las actividades que caen en esta categoria',
        type: String,
        example: "A menos de 15 días"
    })
    descripcion: string;
}