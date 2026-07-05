import { ApiProperty } from "@nestjs/swagger";

class RezagoDto{
    @ApiProperty({
        description: 'ID unico del centro universitario',
        type: String,
        example:"uuid-cucs-999"
    })
    centro_id: string;

    @ApiProperty({
        description: 'Clave del centro universitario',
        type: String,
        example:"CUCS"
    })
    centro_clave: string;

    @ApiProperty({
        description: 'Nombre del centro universitario',
        type: String,
        example:"Centro Universitario de Ciencias de la Salud"
    })
    centro_nombre: string;

    @ApiProperty({
        description: 'Numero de actividades criticas',
        type: Number,
        example: 8
    })
    actividades_criticas: number;

    @ApiProperty({
        description: 'Que tanto del total de actividades son criticas',
        type: Number,
        example: 36.3
    })
    porcentaje_del_rezago_global: number;
}

export class RezagoDataDto{
    @ApiProperty({
        description: 'Lista de los centros rezagados',
        type: [RezagoDto]
    })
    data: RezagoDto[];
}