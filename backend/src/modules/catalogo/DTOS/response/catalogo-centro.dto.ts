import { ApiProperty } from "@nestjs/swagger";

class CentroDto{
    @ApiProperty({
        description: 'ID del centro de trabajo',
        type: String,
        example: "centro-uuid-1"
    })
    id: string;

    @ApiProperty({
        description: 'Clave del centro universitario',
        type: String,
        example: "CUCEI"
    })
    clave: string;

    @ApiProperty({
        description: 'Nombre del centro universitario',
        type: String,
        example: "Centro Universitario de Ciencias Exactas e Ingenierías"
    })
    nombre: string;

    @ApiProperty({
        description: 'Subtítulo para la interfaz',
        type: String,
        example: "Ciencias Exactas"
    })
    subtitulo_interfaz: string;
}

export class CentroDataDto{
    @ApiProperty({
        description: 'Lista de centros de trabajo',
        type: [CentroDto],
    })
    data: CentroDto[];
}