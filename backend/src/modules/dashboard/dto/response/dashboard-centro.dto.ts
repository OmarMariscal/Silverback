import { ApiProperty } from "@nestjs/swagger";

export class CentroUniversitarioDto{
    @ApiProperty({
        description: "Clave del centro universitario",
        type: String,
        example: "CU VALLES"
    })
    clave: string;

    @ApiProperty({
        description: "Nombre del centro universitario",
        type: String,
        example: "Centro Universitario de los Valles"
    })
    nombre: string;
}