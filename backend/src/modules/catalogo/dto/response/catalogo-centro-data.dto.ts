import { ApiProperty } from "@nestjs/swagger";
import { CentroDto } from "./catalogo-centro.dto";

export class CentroDataDto{
    @ApiProperty({
        description: 'Lista de centros de trabajo',
        type: [CentroDto],
    })
    data: CentroDto[];
}