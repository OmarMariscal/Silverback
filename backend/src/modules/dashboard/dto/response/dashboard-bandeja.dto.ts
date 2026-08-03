import { ApiProperty } from "@nestjs/swagger";

export class BandejaEntradaDto{
    @ApiProperty({
        description: "Número de actividades devueltas para corrección",
        type: Number,
        example: 3
    })
    devueltas: number;

    @ApiProperty({
        description: "Número de actividades listas para empezar",
        type: Number,
        example: 4
    })
    listas_empezar: number;
}